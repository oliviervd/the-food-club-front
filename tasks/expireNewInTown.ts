import type { TaskConfig } from 'payload'

export const expireNewInTownTask: TaskConfig<'expireNewInTown'> = {
    slug: 'expireNewInTown',
    label: 'Expire New In Town',
    retries: 2,
    schedule: [
        {
            cron: '0 2 * * *', // Every day at 02:00 AM
            queue: 'nightly',
        }
    ],
    handler: async ({ req }) => {
        const { payload } = req;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const expired = await payload.find({
            collection: 'venues',
            where: {
                and: [
                    { new: { equals: true } },
                    { newInTownSince: { less_than: thirtyDaysAgo.toISOString() } },
                ]
            },
            limit: 100,
            depth: 0,
        });

        if (expired.docs.length === 0) {
            return { output: { message: 'No expired venues found.' } };
        }

        const expiredIds = expired.docs.map((v) => v.id);

        const catsResult = await payload.find({
            collection: 'cats',
            where: { slug: { equals: 'new-in-town' } },
            depth: 1,
            limit: 1,
        });

        const newInTownCat = catsResult.docs[0];

        if (newInTownCat) {
            const currentVenues: number[] = (newInTownCat.venues?.venues || [])
                .map((v: any) => (typeof v === 'object' ? v.id : v));

            const updatedVenues = currentVenues.filter(
                (id) => !expiredIds.includes(id)
            );

            await payload.update({
                collection: 'cats',
                id: newInTownCat.id,
                data: { venues: { venues: updatedVenues } },
            });

            payload.logger.info(
                `[expireNewInTown] Removed ${expiredIds.length} venue(s) from "new in town" category`
            );
        } else {
            payload.logger.warn(
                '[expireNewInTown] Could not find "new in town" category with slug "new-in-town"'
            );
        }

        await Promise.all(
            expired.docs.map((venue) =>
                payload.update({
                    collection: 'venues',
                    id: venue.id,
                    data: { new: false, newInTownSince: null },
                })
            )
        );

        const names = expired.docs.map((v) => v.venueName).join(', ');
        payload.logger.info(`[expireNewInTown] Expired ${expired.docs.length} venue(s): ${names}`);

        return { output: { expired: expired.docs.length, venues: names } };
    },
 } as any;