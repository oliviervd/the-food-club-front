import { getPayload } from 'payload';
import config from '../../../../payload.config';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get('locale') || 'en';

        const payload = await getPayload({ config });

        const result = await payload.find({
            collection: 'cats',
            locale,
            limit: 1000
        });

        return Response.json(result);
    } catch (error) {
        console.error('Error fetching cats:', error);
        return Response.json({ error: 'Failed to fetch categos' }, { status: 500 });
    }
}