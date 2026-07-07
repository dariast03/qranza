import { inArray } from "drizzle-orm";

import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { industry } from "../schema/base";

const industries = [
	// Parents
	{ code: "beauty_and_personal_care", name: "Beauty & Personal Care", icon: "sparkles", parentId: null },
	{ code: "charities_education_and_membership", name: "Charities, Education & Membership", icon: "graduation-cap", parentId: null },
	{ code: "pet_care", name: "Pet Care", icon: "paw-print", parentId: null },
	{ code: "fitness", name: "Fitness", icon: "dumbbell", parentId: null },
	{ code: "home_and_repair", name: "Home & Repair", icon: "wrench", parentId: null },
	{ code: "food_and_drink", name: "Food & Drink", icon: "utensils", parentId: null },
	{ code: "retail", name: "Retail", icon: "store", parentId: null },
	{ code: "leisure_and_entertainment", name: "Leisure & Entertainment", icon: "party-popper", parentId: null },
	{ code: "health_care", name: "Health Care", icon: "heart-pulse", parentId: null },
	{ code: "professional_services", name: "Professional Services", icon: "briefcase", parentId: null },
	{ code: "transportation", name: "Transportation", icon: "car", parentId: null },
	{ code: "casual_use", name: "Casual Use", icon: "shopping-bag", parentId: null },

	// Beauty & Personal Care
	{ code: "hair_salon", name: "Hair Salon", icon: "scissors", parentId: "beauty_and_personal_care" },
	{ code: "nail_salon", name: "Nail Salon", icon: "sparkles", parentId: "beauty_and_personal_care" },
	{ code: "spa", name: "Spa", icon: "flower", parentId: "beauty_and_personal_care" },
	{ code: "barbershop", name: "Barbershop", icon: "scissors", parentId: "beauty_and_personal_care" },
	{ code: "tattoo_parlor", name: "Tattoo Parlor", icon: "pen-tool", parentId: "beauty_and_personal_care" },
	{ code: "cosmetics_store", name: "Cosmetics Store", icon: "palette", parentId: "beauty_and_personal_care" },

	// Charities, Education & Membership
	{ code: "school", name: "School", icon: "school", parentId: "charities_education_and_membership" },
	{ code: "nonprofit", name: "Nonprofit", icon: "heart", parentId: "charities_education_and_membership" },
	{ code: "membership_organization", name: "Membership Organization", icon: "users", parentId: "charities_education_and_membership" },
	{ code: "tutoring", name: "Tutoring", icon: "book-open", parentId: "charities_education_and_membership" },
	{ code: "daycare", name: "Daycare", icon: "baby", parentId: "charities_education_and_membership" },

	// Pet Care
	{ code: "pet_store", name: "Pet Store", icon: "shopping-bag", parentId: "pet_care" },
	{ code: "veterinary", name: "Veterinary", icon: "stethoscope", parentId: "pet_care" },
	{ code: "dog_grooming", name: "Dog Grooming", icon: "scissors", parentId: "pet_care" },
	{ code: "pet_boarding", name: "Pet Boarding", icon: "home", parentId: "pet_care" },
	{ code: "pet_training", name: "Pet Training", icon: "target", parentId: "pet_care" },

	// Fitness
	{ code: "gym", name: "Gym", icon: "dumbbell", parentId: "fitness" },
	{ code: "personal_training", name: "Personal Training", icon: "user", parentId: "fitness" },
	{ code: "yoga_studio", name: "Yoga Studio", icon: "flower", parentId: "fitness" },
	{ code: "dance_studio", name: "Dance Studio", icon: "music", parentId: "fitness" },
	{ code: "martial_arts", name: "Martial Arts", icon: "swords", parentId: "fitness" },
	{ code: "crossfit", name: "CrossFit", icon: "flame", parentId: "fitness" },

	// Home & Repair
	{ code: "plumber", name: "Plumber", icon: "droplets", parentId: "home_and_repair" },
	{ code: "electrician", name: "Electrician", icon: "zap", parentId: "home_and_repair" },
	{ code: "handyman", name: "Handyman", icon: "wrench", parentId: "home_and_repair" },
	{ code: "landscaping", name: "Landscaping", icon: "leaf", parentId: "home_and_repair" },
	{ code: "cleaning_service", name: "Cleaning Service", icon: "sparkles", parentId: "home_and_repair" },
	{ code: "interior_design", name: "Interior Design", icon: "paintbrush", parentId: "home_and_repair" },
	{ code: "appliance_repair", name: "Appliance Repair", icon: "settings", parentId: "home_and_repair" },

	// Food & Drink
	{ code: "restaurant", name: "Restaurant", icon: "utensils", parentId: "food_and_drink" },
	{ code: "cafe", name: "Cafe", icon: "coffee", parentId: "food_and_drink" },
	{ code: "bar", name: "Bar", icon: "wine", parentId: "food_and_drink" },
	{ code: "bakery", name: "Bakery", icon: "cake", parentId: "food_and_drink" },
	{ code: "food_truck", name: "Food Truck", icon: "truck", parentId: "food_and_drink" },
	{ code: "catering", name: "Catering", icon: "calendar", parentId: "food_and_drink" },
	{ code: "ice_cream_shop", name: "Ice Cream Shop", icon: "ice-cream", parentId: "food_and_drink" },
	{ code: " juice_bar", name: "Juice Bar", icon: "glass-water", parentId: "food_and_drink" },

	// Retail
	{ code: "clothing_store", name: "Clothing Store", icon: "shirt", parentId: "retail" },
	{ code: "electronics_store", name: "Electronics Store", icon: "smartphone", parentId: "retail" },
	{ code: "grocery_store", name: "Grocery Store", icon: "shopping-cart", parentId: "retail" },
	{ code: "convenience_store", name: "Convenience Store", icon: "store", parentId: "retail" },
	{ code: "shoe_store", name: "Shoe Store", icon: "footprints", parentId: "retail" },
	{ code: "jewelry_store", name: "Jewelry Store", icon: "gem", parentId: "retail" },
	{ code: "toy_store", name: "Toy Store", icon: "puzzle", parentId: "retail" },
	{ code: "bookstore", name: "Bookstore", icon: "book-open", parentId: "retail" },
	{ code: "furniture_store", name: "Furniture Store", icon: "sofa", parentId: "retail" },
	{ code: "hardware_store", name: "Hardware Store", icon: "wrench", parentId: "retail" },
	{ code: "florist", name: "Florist", icon: "flower", parentId: "retail" },
	{ code: "gift_shop", name: "Gift Shop", icon: "gift", parentId: "retail" },

	// Leisure & Entertainment
	{ code: "event_venue", name: "Event Venue", icon: "calendar", parentId: "leisure_and_entertainment" },
	{ code: "bowling", name: "Bowling", icon: "target", parentId: "leisure_and_entertainment" },
	{ code: "arcade", name: "Arcade", icon: "gamepad-2", parentId: "leisure_and_entertainment" },
	{ code: "cinema", name: "Cinema", icon: "film", parentId: "leisure_and_entertainment" },
	{ code: "karaoke", name: "Karaoke", icon: "mic", parentId: "leisure_and_entertainment" },
	{ code: "nightclub", name: "Nightclub", icon: "music", parentId: "leisure_and_entertainment" },
	{ code: "billiards", name: "Billiards", icon: "circle-dot", parentId: "leisure_and_entertainment" },

	// Health Care
	{ code: "clinic", name: "Clinic", icon: "building-2", parentId: "health_care" },
	{ code: "pharmacy", name: "Pharmacy", icon: "pill", parentId: "health_care" },
	{ code: "dental", name: "Dental", icon: "smile", parentId: "health_care" },
	{ code: "optometry", name: "Optometry", icon: "eye", parentId: "health_care" },
	{ code: "medical_lab", name: "Medical Lab", icon: "flask-conical", parentId: "health_care" },
	{ code: "psychology", name: "Psychology", icon: "brain", parentId: "health_care" },

	// Professional Services
	{ code: "law_firm", name: "Law Firm", icon: "scale", parentId: "professional_services" },
	{ code: "accounting", name: "Accounting", icon: "calculator", parentId: "professional_services" },
	{ code: "consulting", name: "Consulting", icon: "briefcase", parentId: "professional_services" },
	{ code: "real_estate", name: "Real Estate", icon: "home", parentId: "professional_services" },
	{ code: "photography_studio", name: "Photography Studio", icon: "camera", parentId: "professional_services" },
	{ code: "marketing_agency", name: "Marketing Agency", icon: "megaphone", parentId: "professional_services" },
	{ code: "coworking_space", name: "Coworking Space", icon: "building", parentId: "professional_services" },

	// Transportation
	{ code: "taxi", name: "Taxi", icon: "car", parentId: "transportation" },
	{ code: "delivery", name: "Delivery", icon: "truck", parentId: "transportation" },
	{ code: "moving_service", name: "Moving Service", icon: "package", parentId: "transportation" },
	{ code: "auto_repair", name: "Auto Repair", icon: "settings", parentId: "transportation" },
	{ code: "car_wash", name: "Car Wash", icon: "droplets", parentId: "transportation" },
	{ code: "parking", name: "Parking", icon: "square-parking", parentId: "transportation" },

	// Casual Use
	{ code: "pop_up_shop", name: "Pop-up Shop", icon: "tent", parentId: "casual_use" },
	{ code: "flea_market", name: "Flea Market", icon: "store", parentId: "casual_use" },
	{ code: "garage_sale", name: "Garage Sale", icon: "home", parentId: "casual_use" },
	{ code: "street_vendor", name: "Street Vendor", icon: "map-pin", parentId: "casual_use" },
] as const;

export const name = "industries";

export async function seed(db: NodePgDatabase<Record<string, never>>) {
	const allCodes = industries.map((i) => i.code);
	const rows = await db.select({ code: industry.code }).from(industry).where(inArray(industry.code, allCodes));
	const existingSet = new Set(rows.map((r) => r.code));

	const toInsert = industries.filter((i) => !existingSet.has(i.code));

	if (toInsert.length > 0) {
		await db.insert(industry).values(
			toInsert.map((i) => ({
				code: i.code,
				name: i.name,
				icon: i.icon,
				parentId: i.parentId,
			})),
		);
	}

	console.log(`  [industries] ${toInsert.length} created, ${industries.length - toInsert.length} skipped (already exist)`);
}
