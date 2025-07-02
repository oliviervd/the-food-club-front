import { getPayload } from 'payload';
import config from '../payload.config';

let payload = null;

export const getPayloadInstance = async () => {
  if (!payload) {
    payload = await getPayload({ config });
  }
  return payload;
};

export const fetchPayloadData = async (collection, locale = 'en', options = {}) => {
  try {
    const payloadInstance = await getPayloadInstance();
    
    const result = await payloadInstance.find({
      collection,
      locale,
      limit: options.limit || 1000,
      where: options.where || {},
      sort: options.sort || undefined,
      ...options
    });
    
    return result;
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    throw error;
  }
};

export const findPayloadDocument = async (collection, slug, locale = 'en') => {
  try {
    const payloadInstance = await getPayloadInstance();
    
    const result = await payloadInstance.find({
      collection,
      locale,
      where: {
        url: {
          equals: slug
        }
      },
      limit: 1
    });
    
    return result.docs[0] || null;
  } catch (error) {
    console.error(`Error finding ${collection} with slug ${slug}:`, error);
    throw error;
  }
};
