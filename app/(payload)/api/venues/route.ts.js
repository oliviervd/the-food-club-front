import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const cuisine = searchParams.get('cuisine');
    const location = searchParams.get('location');

    const payload = await getPayload({ config });

    const where = cuisine ? {
        'information.dishes.name': {
            equals: cuisine
        },
        _status: {
            equals: 'published'
        },
        ...(location ? { club: { equals: location } } : {})
    } : {};

    try {
        const result = await payload.find({
            collection: 'venues',
            depth: 2,
            where
        });

        return Response.json(result);
    } catch (error) {
        console.error('Error fetching venues:', error);
        return Response.json({ error: 'Failed to fetch venues' }, { status: 500 });
    }
}