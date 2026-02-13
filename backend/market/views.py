import csv
import json
import logging
import time
from pathlib import Path
from threading import Lock

import requests
from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import ProductListing, ProductInquiry
from .serializers import ProductListingSerializer, ProductInquirySerializer

logger = logging.getLogger(__name__)

# module-level lock for CSV reads
_csv_lock = Lock()


class ProductListingViewSet(viewsets.ModelViewSet):
    queryset = ProductListing.objects.all()
    serializer_class = ProductListingSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            import csv
            import json
            import logging
            import time
            from pathlib import Path
            from threading import Lock

            import requests
            from django.conf import settings
            from rest_framework import status, viewsets
            from rest_framework.decorators import action, api_view, permission_classes
            from rest_framework.permissions import AllowAny
            from rest_framework.response import Response

            from .models import ProductListing, ProductInquiry
            from .serializers import ProductListingSerializer, ProductInquirySerializer

            logger = logging.getLogger(__name__)

            # module-level lock for CSV reads
            _csv_lock = Lock()


            class ProductListingViewSet(viewsets.ModelViewSet):
                queryset = ProductListing.objects.all()
                serializer_class = ProductListingSerializer

                def get_permissions(self):
                    if self.action in ('create', 'update', 'partial_update', 'destroy'):
                        from rest_framework.permissions import IsAuthenticated

                        return [IsAuthenticated()]
                    return [AllowAny()]

                def get_queryset(self):
                    queryset = ProductListing.objects.all()
                    state = self.request.GET.get('state') or self.request.GET.get('filters[state.keyword]')
                    district = self.request.GET.get('district') or self.request.GET.get('filters[district]')
                    if state:
                        queryset = queryset.filter(state__iexact=state)
                    if district:
                        queryset = queryset.filter(district__iexact=district)
                    return queryset

                def perform_create(self, serializer):
                    serializer.save(seller=self.request.user)

                @action(detail=False, methods=['get'])
                def my_listings(self, request):
                    listings = ProductListing.objects.filter(seller=request.user)
                    serializer = self.get_serializer(listings, many=True)
                    return Response(serializer.data)


            class ProductInquiryViewSet(viewsets.ModelViewSet):
                queryset = ProductInquiry.objects.all()
                serializer_class = ProductInquirySerializer
                permission_classes = [AllowAny]

                def get_queryset(self):
                    user = self.request.user
                    if user.is_staff:
                        return ProductInquiry.objects.all()
                    return ProductInquiry.objects.filter(buyer=user) | ProductInquiry.objects.filter(listing__seller=user)

                def perform_create(self, serializer):
                    serializer.save(buyer=self.request.user)

                @action(detail=True, methods=['post'])
                def reply(self, request, pk=None):
                    inquiry = self.get_object()
                    if inquiry.listing.seller != request.user:
                        return Response({'error': 'Only the seller can reply'}, status=status.HTTP_403_FORBIDDEN)
                    reply_text = request.data.get('reply', '')
                    if not reply_text:
                        return Response({'error': 'Reply text required'}, status=status.HTTP_400_BAD_REQUEST)
                    inquiry.seller_reply = reply_text
                    inquiry.status = 'replied'
                    inquiry.save()
                    serializer = self.get_serializer(inquiry)
                    return Response(serializer.data)


            @api_view(['GET'])
            @permission_classes([AllowAny])
            def mandi_prices(request):
                """Proxy endpoint to fetch mandi/market data.

                Order: CSV -> external -> DB fallback -> LLM fallback
                """
                base_url = getattr(settings, 'MANDI_API_URL', None)
                api_key = getattr(settings, 'MANDI_API_KEY', None)

                data = {'records': []}

                # CSV-first
                csv_path = Path(getattr(settings, 'BASE_DIR', Path('.'))) / '9ef84268-d588-465a-a308-a864a43d0070.csv'
                csv_used = False
                if csv_path.exists():
                    try:
                        with _csv_lock:
                            with csv_path.open(newline='', encoding='utf-8') as fh:
                                reader = csv.DictReader(fh)
                                records = []
                                state_filter = request.GET.get('filters[state.keyword]') or request.GET.get('state')
                                district_filter = request.GET.get('filters[district]') or request.GET.get('district')
                                limit = int(request.GET.get('limit') or 100)
                                for row in reader:
                                    rec = {
                                        'state': (row.get('State') or row.get('state') or '').strip(),
                                        'district': (row.get('District') or row.get('district') or '').strip(),
                                        'market': (row.get('Market') or row.get('market') or '').strip(),
                                    }
                                    if state_filter and rec['state'].lower() != state_filter.lower():
                                        continue
                                    if district_filter and rec['district'].lower() != district_filter.lower():
                                        continue
                                    records.append(rec)
                                    if len(records) >= limit:
                                        break
                        data = {'status': 'ok', 'total': len(records), 'count': len(records), 'limit': str(limit), 'offset': '0', 'records': records}
                        csv_used = True
                    except Exception:
                        logger.exception('Failed to read local CSV; falling through to external API')

                # External API
                allowed_keys = [
                    'format', 'offset', 'limit',
                    'filters[state.keyword]', 'filters[district]', 'filters[market]',
                    'filters[commodity]', 'filters[variety]', 'filters[grade]'
                ]

                params = {'api-key': api_key} if api_key else {}
                for k in allowed_keys:
                    v = request.GET.get(k)
                    if v:
                        params[k] = v
                params.setdefault('format', 'json')

                resp = None
                if not csv_used and base_url:
                    try:
                        resp = requests.get(base_url, params=params, timeout=10)
                    except requests.RequestException:
                        logger.exception('External Mandi API request failed; continuing to fallbacks')

                if not csv_used and resp is not None:
                    if resp.status_code != 200:
                        detail_text = resp.text
                        try:
                            detail_json = resp.json()
                        except ValueError:
                            detail_json = None

                        if resp.status_code in (401, 403):
                            msg = 'Mandi API rejected the request (invalid or unauthorized API key).'
                            msg += ' Set environment variable MANDI_API_KEY to a valid data.gov.in API key.'
                            return Response({'error': 'Mandi API unauthorized', 'status_code': resp.status_code, 'detail': detail_json or detail_text, 'message': msg}, status=status.HTTP_502_BAD_GATEWAY)

                        return Response({'error': 'Mandi API error', 'status_code': resp.status_code, 'detail': detail_json or detail_text}, status=status.HTTP_502_BAD_GATEWAY)

                    try:
                        data = resp.json()
                    except ValueError:
                        return Response({'data': resp.text})

                # Local ProductListing fallback
                records = data.get('records') if isinstance(data, dict) else None
                if (isinstance(records, list) and len(records) == 0) or records is None:
                    state_filter = request.GET.get('filters[state.keyword]') or request.GET.get('state')
                    district_filter = request.GET.get('filters[district]') or request.GET.get('district')

                    listings_qs = ProductListing.objects.filter(status='available')
                    if state_filter:
                        listings_qs = listings_qs.filter(state__iexact=state_filter)
                    if district_filter:
                        listings_qs = listings_qs.filter(district__iexact=district_filter)

                    fallback = []
                    for l in listings_qs[:50]:
                        fallback.append({
                            'id': l.id,
                            'title': l.title,
                            'seller': getattr(l.seller, 'username', None),
                            'state': l.state,
                            'district': l.district,
                        })

                    if isinstance(data, dict):
                        data['fallback_listings'] = fallback
                    else:
                        data = {'records': [], 'fallback_listings': fallback}

                # LLM fallback
                try:
                    if not hasattr(mandi_prices, '_llm_cache'):
                        mandi_prices._llm_cache = {}
                        mandi_prices._LLM_TTL = 24 * 60 * 60

                    state_filter = request.GET.get('filters[state.keyword]') or request.GET.get('state')
                    district_filter = request.GET.get('filters[district]') or request.GET.get('district')

                    records = data.get('records') if isinstance(data, dict) else []
                    fallback = data.get('fallback_listings') if isinstance(data, dict) else []

                    force_llm = request.GET.get('force_llm') == '1'
                    if force_llm:
                        data['llm_forced'] = True

                    if (not records and not fallback) or force_llm:
                        openai_key = getattr(settings, 'OPENAI_API_KEY', '')
                        if force_llm and not openai_key:
                            data.setdefault('synthetic_markets', [])
                            data.setdefault('synthetic', False)
                            data['llm_attempted'] = False
                            data['llm_reason'] = 'OPENAI_API_KEY missing'
                            logger.info('LLM force requested but OPENAI_API_KEY is missing')
                        else:
                            cache_key = f"llm::{state_filter or ''}::{district_filter or ''}"
                            now = time.time()
                            cached = mandi_prices._llm_cache.get(cache_key)
                            if cached and now - cached['ts'] < mandi_prices._LLM_TTL:
                                synthetic = cached['data']
                            else:
                                synthetic = []
                                if openai_key:
                                    logger.info('LLM calling OpenAI API for %s/%s', state_filter, district_filter)
                                    prompt = (
                                        f"Given the Indian state '{state_filter}' and district '{district_filter}', provide up to 5 nearby mandi/market names for farmers to sell produce. "
                                        "Return EXACTLY a JSON array (no surrounding text) of objects with keys: market, district, state. "
                                        "Do NOT include prices, addresses or phone numbers. If unsure, return an empty array."
                                    )
                                    headers = {'Authorization': f'Bearer {openai_key}', 'Content-Type': 'application/json'}
                                    body = {
                                        'model': 'gpt-3.5-turbo',
                                        'messages': [
                                            {'role': 'system', 'content': 'You are a helpful assistant that returns only JSON.'},
                                            {'role': 'user', 'content': prompt},
                                        ],
                                        'temperature': 0.0,
                                        'max_tokens': 300,
                                    }
                                    try:
                                        r = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=body, timeout=15)
                                        r.raise_for_status()
                                        text = r.json()['choices'][0]['message']['content'].strip()
                                        parsed = []
                                        try:
                                            parsed = json.loads(text)
                                        except Exception:
                                            start = text.find('[')
                                            end = text.rfind(']')
                                            if start != -1 and end != -1 and end > start:
                                                try:
                                                    parsed = json.loads(text[start:end+1])
                                                except Exception:
                                                    parsed = []
                                        if isinstance(parsed, list):
                                            for item in parsed[:5]:
                                                if isinstance(item, dict) and item.get('market'):
                                                    synthetic.append({
                                                        'market': str(item.get('market')).strip(),
                                                        'district': str(item.get('district') or district_filter or '').strip(),
                                                        'state': str(item.get('state') or state_filter or '').strip(),
                                                    })
                                    except Exception:
                                        logger.exception('OpenAI LLM call failed')

                                mandi_prices._llm_cache[cache_key] = {'ts': now, 'data': synthetic}

                            if synthetic:
                                if isinstance(data, dict):
                                    data['synthetic_markets'] = synthetic
                                    data['synthetic'] = True
                                    data['disclaimer'] = 'These markets are AI-suggested. Verify before relying on them.'
                                else:
                                    data = {'records': [], 'fallback_listings': [], 'synthetic_markets': synthetic, 'synthetic': True, 'disclaimer': 'These markets are AI-suggested. Verify before relying on them.'}
                            else:
                                if isinstance(data, dict):
                                    data.setdefault('synthetic_markets', [])
                                    data.setdefault('synthetic', False)
                                else:
                                    data = {'records': [], 'fallback_listings': [], 'synthetic_markets': [], 'synthetic': False}
                except Exception:
                    logger.exception('LLM fallback encountered an error')

                return Response(data)
                                data = {'records': [], 'fallback_listings': [], 'synthetic_markets': [], 'synthetic': False}
            except Exception:
                logger.exception('LLM fallback encountered an error')

            return Response(data)
                        return ProductInquiry.objects.all()
                    return ProductInquiry.objects.filter(buyer=user) | ProductInquiry.objects.filter(listing__seller=user)

                def perform_create(self, serializer):
                    serializer.save(buyer=self.request.user)

                @action(detail=True, methods=['post'])
                def reply(self, request, pk=None):
                    inquiry = self.get_object()
                    if inquiry.listing.seller != request.user:
                        return Response({'error': 'Only the seller can reply'}, status=status.HTTP_403_FORBIDDEN)
                    reply_text = request.data.get('reply', '')
                    if not reply_text:
                        return Response({'error': 'Reply text required'}, status=status.HTTP_400_BAD_REQUEST)
                    inquiry.seller_reply = reply_text
                    inquiry.status = 'replied'
                    inquiry.save()
                    serializer = self.get_serializer(inquiry)
                    return Response(serializer.data)


            @api_view(['GET'])
            @permission_classes([AllowAny])
            def mandi_prices(request):
                """Proxy endpoint to fetch mandi/market data.

                Order: CSV -> external -> DB fallback -> LLM fallback
                """
                base_url = getattr(settings, 'MANDI_API_URL', None)
                api_key = getattr(settings, 'MANDI_API_KEY', None)

                data = {'records': []}

                # CSV-first
                csv_path = Path(getattr(settings, 'BASE_DIR', Path('.'))) / '9ef84268-d588-465a-a308-a864a43d0070.csv'
                csv_used = False
                if csv_path.exists():
                    state_filter = request.GET.get('filters[state.keyword]') or request.GET.get('state')
                    district_filter = request.GET.get('filters[district]') or request.GET.get('district')
                    limit = int(request.GET.get('limit') or 100)
                    try:
                        with _csv_lock:
                            with csv_path.open(newline='', encoding='utf-8') as fh:
                                reader = csv.DictReader(fh)
                                records = []
                                for row in reader:
                                    rec = {
                                        'state': (row.get('State') or row.get('state') or '').strip(),
                                        'district': (row.get('District') or row.get('district') or '').strip(),
                                        'market': (row.get('Market') or row.get('market') or '').strip(),
                                        'commodity': (row.get('Commodity') or row.get('commodity') or '').strip(),
                                        'variety': (row.get('Variety') or row.get('variety') or '').strip(),
                                        'grade': (row.get('Grade') or row.get('grade') or '').strip(),
                                        'arrival_date': (row.get('Arrival_Date') or row.get('arrival_date') or '').strip(),
                                    }
                                    if state_filter and rec['state'].lower() != state_filter.lower():
                                        continue
                                    if district_filter and rec['district'].lower() != district_filter.lower():
                                        continue
                                    records.append(rec)
                                    if len(records) >= limit:
                                        break
                        data = {'status': 'ok', 'total': len(records), 'count': len(records), 'limit': str(limit), 'offset': '0', 'records': records}
                        csv_used = True
                    except Exception:
                        logger.exception('Failed to read local CSV; falling through to external API')

                # External API (do not early-return on error; let LLM fallback run)
                allowed_keys = [
                    'format', 'offset', 'limit',
                    'filters[state.keyword]', 'filters[district]', 'filters[market]',
                    'filters[commodity]', 'filters[variety]', 'filters[grade]'
                ]

                params = {'api-key': api_key} if api_key else {}
                for k in allowed_keys:
                    v = request.GET.get(k)
                    if v:
                        params[k] = v
                params.setdefault('format', 'json')

                if not csv_used and base_url:
                    try:
                        resp = requests.get(base_url, params=params, timeout=10)
                        if resp.status_code == 200:
                            try:
                                data = resp.json()
                            except ValueError:
                                data = {'records': []}
                        else:
                            if resp.status_code in (401, 403):
                                # auth problems
                                logger.warning('Mandi API returned unauthorized: %s', resp.status_code)
                                data = {'records': []}
                            else:
                                data = {'records': []}
                    except requests.RequestException:
                        # log and continue — allow LLM fallback to run
                        logger.exception('External Mandi API request failed; continuing to fallbacks')
                        data = {'records': []}

                # Local ProductListing fallback
                records = data.get('records') if isinstance(data, dict) else []
                if not records:
                    state_filter = request.GET.get('filters[state.keyword]') or request.GET.get('state')
                    district_filter = request.GET.get('filters[district]') or request.GET.get('district')

                    listings_qs = ProductListing.objects.filter(status='available')
                    if state_filter:
                        listings_qs = listings_qs.filter(state__iexact=state_filter)
                    if district_filter:
                        listings_qs = listings_qs.filter(district__iexact=district_filter)

                    fallback = []
                    for l in listings_qs[:50]:
                        fallback.append({
                            'id': l.id,
                            'title': l.title,
                            'seller': getattr(l.seller, 'username', None),
                            'state': l.state,
                            'district': l.district,
                            'address': l.address,
                        })

                    if isinstance(data, dict):
                        data['fallback_listings'] = fallback
                    else:
                        data = {'records': [], 'fallback_listings': fallback}

                # LLM fallback
                try:
                    if not hasattr(mandi_prices, '_llm_cache'):
                        mandi_prices._llm_cache = {}
                        mandi_prices._LLM_TTL = 24 * 60 * 60

                    state_filter = request.GET.get('filters[state.keyword]') or request.GET.get('state')
                    district_filter = request.GET.get('filters[district]') or request.GET.get('district')
                    records = data.get('records') if isinstance(data, dict) else []
                    fallback = data.get('fallback_listings') if isinstance(data, dict) else []

                    force_llm = request.GET.get('force_llm') == '1'
                    if force_llm:
                        data['llm_forced'] = True

                    if (not records and not fallback) or force_llm:
                        openai_key = getattr(settings, 'OPENAI_API_KEY', '')
                        if force_llm and not openai_key:
                            data.setdefault('synthetic_markets', [])
                            data.setdefault('synthetic', False)
                            data['llm_attempted'] = False
                            data['llm_reason'] = 'OPENAI_API_KEY missing'
                            logger.info('LLM force requested but OPENAI_API_KEY is missing')
                        else:
                            cache_key = f"llm::{state_filter or ''}::{district_filter or ''}"
                            now = time.time()
                            cached = mandi_prices._llm_cache.get(cache_key)
                            if cached and now - cached['ts'] < mandi_prices._LLM_TTL:
                                synthetic = cached['data']
                                logger.info('LLM cache hit: %s (items=%d)', cache_key, len(synthetic) if synthetic else 0)
                            else:
                                synthetic = []
                                if openai_key:
                                    logger.info('LLM calling OpenAI API for %s/%s', state_filter, district_filter)
                                    prompt = (
                                        f"Given the Indian state '{state_filter}' and district '{district_filter}', provide up to 5 nearby mandi/market names for farmers to sell produce. "
                                        "Return EXACTLY a JSON array (no surrounding text) of objects with keys: market, district, state. "
                                        "Do NOT include prices, addresses or phone numbers. If unsure, return an empty array."
                                    )
                                    headers = {'Authorization': f'Bearer {openai_key}', 'Content-Type': 'application/json'}
                                    body = {
                                        'model': 'gpt-3.5-turbo',
                                        'messages': [
                                            {'role': 'system', 'content': 'You are a helpful assistant that returns only JSON.'},
                                            {'role': 'user', 'content': prompt},
                                        ],
                                        'temperature': 0.0,
                                        'max_tokens': 300,
                                    }
                                    try:
                                        r = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=body, timeout=15)
                                        r.raise_for_status()
                                        text = r.json()['choices'][0]['message']['content'].strip()
                                        parsed = []
                                        try:
                                            parsed = json.loads(text)
                                        except Exception:
                                            start = text.find('[')
                                            end = text.rfind(']')
                                            if start != -1 and end != -1 and end > start:
                                                try:
                                                    parsed = json.loads(text[start:end+1])
                                                except Exception:
                                                    parsed = []
                                        if isinstance(parsed, list):
                                            for item in parsed[:5]:
                                                if isinstance(item, dict) and item.get('market'):
                                                    synthetic.append({
                                                        'market': str(item.get('market')).strip(),
                                                        'district': str(item.get('district') or district_filter or '').strip(),
                                                        'state': str(item.get('state') or state_filter or '').strip(),
                                                    })
                                    except Exception:
                                        logger.exception('OpenAI LLM call failed')

                                mandi_prices._llm_cache[cache_key] = {'ts': now, 'data': synthetic}

                            if synthetic:
                                if isinstance(data, dict):
                                    data['synthetic_markets'] = synthetic
                                    data['synthetic'] = True
                                    data['disclaimer'] = 'These markets are AI-suggested. Verify before relying on them.'
                                else:
                                    data = {'records': [], 'fallback_listings': [], 'synthetic_markets': synthetic, 'synthetic': True, 'disclaimer': 'These markets are AI-suggested. Verify before relying on them.'}
                            else:
                                if isinstance(data, dict):
                                    data.setdefault('synthetic_markets', [])
                                    data.setdefault('synthetic', False)
                                else:
                                    data = {'records': [], 'fallback_listings': [], 'synthetic_markets': [], 'synthetic': False}
                except Exception:
                    logger.exception('LLM fallback encountered an error')

                return Response(data)
                        except Exception:
                            start = text.find('[')
                            end = text.rfind(']')
                            if start != -1 and end != -1 and end > start:
                                try:
                                    parsed = json.loads(text[start:end+1])
                                except Exception:
                                    parsed = []
                        if isinstance(parsed, list):
                            for item in parsed[:5]:
                                if isinstance(item, dict) and item.get('market'):
                                    synthetic.append({
                                        'market': str(item.get('market')).strip(),
                                        'district': str(item.get('district') or district_filter or '').strip(),
                                        'state': str(item.get('state') or state_filter or '').strip(),
                                    })
                    except Exception:
                        logger.exception('OpenAI LLM call failed')

                mandi_prices._llm_cache[cache_key] = {'ts': now, 'data': synthetic}

            if synthetic:
                if isinstance(data, dict):
                    data['synthetic_markets'] = synthetic
                    data['synthetic'] = True
                    data['disclaimer'] = 'These markets are AI-suggested. Verify before relying on them.'
                else:
                    data = {'records': [], 'fallback_listings': [], 'synthetic_markets': synthetic, 'synthetic': True, 'disclaimer': 'These markets are AI-suggested. Verify before relying on them.'}
            else:
                if isinstance(data, dict):
                    data.setdefault('synthetic_markets', [])
                    data.setdefault('synthetic', False)
                else:
                    data = {'records': [], 'fallback_listings': [], 'synthetic_markets': [], 'synthetic': False}
    except Exception:
        logger.exception('LLM fallback encountered an error')

    return Response(data)
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """Seller reply to inquiry"""
        inquiry = self.get_object()
        
        if inquiry.listing.seller != request.user:
            return Response({'error': 'Only the seller can reply'}, status=status.HTTP_403_FORBIDDEN)
        
        reply_text = request.data.get('reply', '')
        if not reply_text:
            return Response({'error': 'Reply text required'}, status=status.HTTP_400_BAD_REQUEST)
        
        inquiry.seller_reply = reply_text
        inquiry.status = 'replied'
        inquiry.save()
        
        serializer = self.get_serializer(inquiry)
        return Response(serializer.data)



@api_view(['GET'])
@permission_classes([AllowAny])
def mandi_prices(request):
    """Proxy endpoint to fetch mandi/market prices from data.gov.in resource using configured API key.

    Accepts query params similar to the data.gov.in API, e.g.
      - format (json/xml/csv)
      - offset, limit
      - filters[state.keyword], filters[district], filters[market], filters[commodity], filters[variety], filters[grade]
    """
    base_url = getattr(settings, 'MANDI_API_URL', None)
    api_key = getattr(settings, 'MANDI_API_KEY', None)

    if not base_url or not api_key:
        return Response({'error': 'Mandi API not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # If a local CSV dataset exists in the backend root, use it first (faster, avoids external calls)
    # Expected CSV: backend/9ef84268-d588-465a-a308-a864a43d0070.csv
    _csv_lock = Lock()
    csv_path = Path(getattr(settings, 'BASE_DIR', Path('.'))) / '9ef84268-d588-465a-a308-a864a43d0070.csv'
    csv_used = False
    if csv_path.exists():
        # load CSV and filter
        try:
            with _csv_lock:
                with csv_path.open(newline='', encoding='utf-8') as fh:
                    reader = csv.DictReader(fh)
                    records = []
                    state_filter = request.GET.get('filters[state.keyword]') or request.GET.get('state')
                    district_filter = r
                    equest.GET.get('filters[district]') or request.GET.get('district')
                    limit = int(request.GET.get('limit') or 100)
                    for row in reader:
                        # Normalize keys to simple names used elsewhere
                        rec = {
                            'state': (row.get('State') or row.get('state') or '').strip(),
                            'district': (row.get('District') or row.get('district') or '').strip(),
                            'market': (row.get('Market') or row.get('market') or '').strip(),
                            'commodity': (row.get('Commodity') or row.get('commodity') or '').strip(),
                            'variety': (row.get('Variety') or row.get('variety') or '').strip(),
                            'grade': (row.get('Grade') or row.get('grade') or '').strip(),
                            'arrival_date': (row.get('Arrival_Date') or row.get('arrival_date') or '').strip(),
                            'min_price': row.get('Min_x0020_Price') or row.get('min_price') or row.get('Min Price') or None,
                            'max_price': row.get('Max_x0020_Price') or row.get('max_price') or row.get('Max Price') or None,
                            'modal_price': row.get('Modal_x0020_Price') or row.get('modal_price') or None,
                        }
                        if state_filter and rec['state'].lower() != state_filter.lower():
                            continue
                        if district_filter and rec['district'].lower() != district_filter.lower():
                            continue
                        records.append(rec)
                        if len(records) >= limit:
                            break
            response = {
                'status': 'ok',
                'total': len(records),
                'count': len(records),
                'limit': str(limit),
                'offset': '0',
                'records': records,
            }
            # don't return here; set data and mark csv_used so downstream logic (fallbacks/LLM)
            # can run when CSV has no matching rows.
            data = response
            csv_used = True
        except Exception as e:
            # if CSV parsing fails, fall through to external API attempt
            pass

    # Build allowed params and forward them
    allowed_keys = [
        'format', 'offset', 'limit',
        'filters[state.keyword]', 'filters[district]', 'filters[market]',
        'filters[commodity]', 'filters[variety]', 'filters[grade]'
    ]

    params = {}
    # always send api-key
    params['api-key'] = api_key

    for k in allowed_keys:
        v = request.GET.get(k)
        if v:
            params[k] = v

    # default to json
    params.setdefault('format', 'json')
    resp = None
    if not csv_used:
        try:
            resp = requests.get(base_url, params=params, timeout=10)
        except requests.RequestException as e:
            # If external API is unreachable, return fallback local listings so frontend can still show nearby markets
            state_filter = request.GET.get('filters[state.keyword]') or request.GET.get('state')
            district_filter = request.GET.get('filters[district]') or request.GET.get('district')

            listings_qs = ProductListing.objects.filter(status='available')
            if state_filter:
                listings_qs = listings_qs.filter(state__iexact=state_filter)
            if district_filter:
                listings_qs = listings_qs.filter(district__iexact=district_filter)

            fallback = []
            for l in listings_qs[:50]:
                fallback.append({
                    'id': l.id,
                    'title': l.title,
                    'seller': getattr(l.seller, 'username', None),
                    'state': l.state,
                    'district': l.district,
                    'address': l.address,
                })

            return Response({'error': 'Failed to reach Mandi API', 'detail': str(e), 'fallback_listings': fallback}, status=status.HTTP_200_OK)

    if not csv_used and resp is not None and resp.status_code != 200:
        # Provide a clearer message for authorization problems
        detail_text = resp.text
        try:
            detail_json = resp.json()
        except ValueError:
            detail_json = None

        if resp.status_code in (401, 403):
            msg = 'Mandi API rejected the request (invalid or unauthorized API key).'
            msg += ' Set environment variable MANDI_API_KEY to a valid data.gov.in API key.'
            return Response({'error': 'Mandi API unauthorized', 'status_code': resp.status_code, 'detail': detail_json or detail_text, 'message': msg}, status=status.HTTP_502_BAD_GATEWAY)

        return Response({'error': 'Mandi API error', 'status_code': resp.status_code, 'detail': detail_json or detail_text}, status=status.HTTP_502_BAD_GATEWAY)

    if not csv_used:
        try:
            data = resp.json()
        except ValueError:
            # If not json, return raw text
            return Response({'data': resp.text})

    # If the external dataset returns no records, provide a fallback using local ProductListing data
    records = data.get('records') if isinstance(data, dict) else None
    if (isinstance(records, list) and len(records) == 0) or records is None:
        # Try to get local listings for the same state/district as a fallback
        state_filter = request.GET.get('filters[state.keyword]') or request.GET.get('state')
        district_filter = request.GET.get('filters[district]') or request.GET.get('district')

        listings_qs = ProductListing.objects.filter(status='available')
        if state_filter:
            listings_qs = listings_qs.filter(state__iexact=state_filter)
        if district_filter:
            listings_qs = listings_qs.filter(district__iexact=district_filter)

        # limit the number of fallback results
        fallback = []
        for l in listings_qs[:50]:
            fallback.append({
                'id': l.id,
                'title': l.title,
                'seller': getattr(l.seller, 'username', None),
                'state': l.state,
                'district': l.district,
                'address': l.address,
            })

        # attach fallback_listings to response so frontend can use it
        if isinstance(data, dict):
            data['fallback_listings'] = fallback
        else:
            data = {'records': [], 'fallback_listings': fallback}

    # LLM fallback: if no records and no local fallback, attempt to ask OpenAI for suggested markets
    try:
        # simple in-memory cache stored on the function object
        if not hasattr(mandi_prices, '_llm_cache'):
            mandi_prices._llm_cache = {}
            mandi_prices._LLM_TTL = 24 * 60 * 60

        state_filter = request.GET.get('filters[state.keyword]') or request.GET.get('state')
        district_filter = request.GET.get('filters[district]') or request.GET.get('district')

        records = data.get('records') if isinstance(data, dict) else []
        fallback = data.get('fallback_listings') if isinstance(data, dict) else []

        # Allow forcing LLM for testing via ?force_llm=1
        force_llm = request.GET.get('force_llm') == '1'
        if (not records or len(records) == 0) and (not fallback or len(fallback) == 0) or force_llm:
            openai_key = getattr(settings, 'OPENAI_API_KEY', '')
            cache_key = f"llm::{state_filter or ''}::{district_filter or ''}"
            logger.info("LLM fallback check: state=%s district=%s cache_key=%s", state_filter, district_filter, cache_key)
            now = time.time()
            cached = mandi_prices._llm_cache.get(cache_key)
            if cached and now - cached['ts'] < mandi_prices._LLM_TTL:
                synthetic = cached['data']
                logger.info("LLM cache hit: %s (items=%d)", cache_key, len(synthetic) if synthetic else 0)
            elif openai_key:
                logger.info("LLM calling OpenAI API (key present)")
                user_prompt = (
                    f"Given the Indian state '{state_filter}' and district '{district_filter}', "
                    "provide up to 5 nearby mandi/market names for farmers to sell produce. "
                    "Return a JSON array of objects with keys: market, district, state. "
                    "Do NOT include prices, addresses or phone numbers. If unsure, return an empty array."
                )
                headers = {
                    'Authorization': f'Bearer {openai_key}',
                    'Content-Type': 'application/json',
                }
                body = {
                    'model': 'gpt-3.5-turbo',
                    'messages': [
                        {'role': 'system', 'content': 'You are a helpful assistant that returns structured JSON.'},
                        {'role': 'user', 'content': user_prompt},
                    ],
                    'temperature': 0.0,
                    'max_tokens': 300,
                }
                synthetic = []
                try:
                    r = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=body, timeout=15)
                    logger.info("OpenAI request sent, status=%s", getattr(r, 'status_code', None))
                    r.raise_for_status()
                    # log truncated response for debugging (do not log full content)
                    resp_text = r.text if isinstance(r.text, str) else str(r.text)
                    logger.debug("OpenAI raw response (truncated 1000 chars): %s", resp_text[:1000])
                    text = r.json()['choices'][0]['message']['content']
                    text = text.strip()
                    parsed = None
                    try:
                        parsed = json.loads(text)
                    except Exception:
                        start = text.find('[')
                        end = text.rfind(']')
                        if start != -1 and end != -1 and end > start:
                            substr = text[start:end+1]
                            try:
                                parsed = json.loads(substr)
                            except Exception:
                                parsed = []
                        else:
                            parsed = []

                    if isinstance(parsed, list):
                        for item in parsed[:5]:
                            if isinstance(item, dict) and item.get('market'):
                                synthetic.append({
                                    'market': str(item.get('market')).strip(),
                                    'district': str(item.get('district') or district_filter or '').strip(),
                                    'state': str(item.get('state') or state_filter or '').strip(),
                                })
                except Exception as exc:
                    logger.exception("OpenAI LLM call failed: %s", exc)
                    synthetic = []

                mandi_prices._llm_cache[cache_key] = {'ts': now, 'data': synthetic}
                logger.info("LLM cached result for %s (items=%d)", cache_key, len(synthetic) if synthetic else 0)
            else:
                logger.info("LLM fallback not attempted: OPENAI_API_KEY missing")
                synthetic = []

            if synthetic:
                if isinstance(data, dict):
                    data['synthetic_markets'] = synthetic
                    data['synthetic'] = True
                    data['disclaimer'] = 'These markets are AI-suggested. Verify before relying on them.'
                else:
                    data = {'records': [], 'fallback_listings': [], 'synthetic_markets': synthetic, 'synthetic': True, 'disclaimer': 'These markets are AI-suggested. Verify before relying on them.'}
                logger.info("LLM produced %d synthetic markets for %s/%s", len(synthetic), state_filter, district_filter)
            else:
                if isinstance(data, dict):
                    data.setdefault('synthetic_markets', [])
                    data.setdefault('synthetic', False)
                else:
                    data = {'records': [], 'fallback_listings': [], 'synthetic_markets': [], 'synthetic': False}
    except Exception:
        # Ensure LLM errors don't break the API
        pass

    return Response(data)
