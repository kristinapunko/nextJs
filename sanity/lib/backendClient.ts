import { createClient } from "next-sanity"; 
import { apiVersion, dataset, projectId} from "../env"; 
// npm install next-sanity@canary 
export const backendClient = createClient({ 
projectId, 
dataset, 
apiVersion, 
useCdn: true, // Set to false if statically generating pages, usin  revalidation 
token: process.env.SANITY_API_TOKEN, 
});