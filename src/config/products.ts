/**
 * Tracxi Product Status Configuration
 * Centralized product data for the entire website
 * Statuses: Published | Under Development | Under Testing | Closed Testing | Research & Development | LLM Under Training
 */

export type ProductStatus =
  | 'Published'
  | 'Under Development'
  | 'Under Testing'
  | 'Closed Testing'
  | 'Research & Development'
  | 'LLM Under Training';

export interface Product {
  id: string;
  name: string;
  status: ProductStatus;
  description: string;
  shortDescription: string;
  sectionOrder: number;
  founderId?: string;
  portfolioUrl?: string;
  isInternal?: boolean;
  tags: string[];
  iconName?: string;
  colorTheme?: 'warm' | 'cool' | 'neutral' | 'champagne';
}

export const products: Product[] = [
  {
    id: 'tracxi-by-suresh-b',
    name: 'Tracxi by Suresh B',
    status: 'Published',
    description: 'The product that started the journey. A logistics and supply chain management platform built for modern operations.',
    shortDescription: 'The foundation. Logistics reimagined.',
    sectionOrder: 4,
    founderId: 'suresh-bodepudi',
    tags: ['logistics', 'supply-chain', 'operations', 'published'],
    colorTheme: 'warm',
  },
  {
    id: 'tracxi-2',
    name: 'Tracxi 2.0',
    status: 'Under Development',
    description: 'The next evolution of the Tracxi platform. Enhanced capabilities, broader scope, and deeper intelligence for logistics operations.',
    shortDescription: 'The evolution. Logistics elevated.',
    sectionOrder: 5,
    tags: ['logistics', 'platform', 'development', 'next-gen'],
    colorTheme: 'warm',
  },
  {
    id: 'vcx-mart',
    name: 'VCX Mart',
    status: 'Under Development',
    description: 'A premium commerce marketplace. Curated products, seamless transactions, and an elevated shopping experience.',
    shortDescription: 'Commerce, curated.',
    sectionOrder: 6,
    tags: ['commerce', 'marketplace', 'development', 'premium'],
    colorTheme: 'champagne',
  },
  {
    id: 'trackspense',
    name: 'Trackspense',
    status: 'Under Testing',
    description: 'Intelligent expense tracking and financial insights. Where money flows with purpose and clarity.',
    shortDescription: 'Finance, tracked.',
    sectionOrder: 7,
    tags: ['finance', 'expenses', 'testing', 'insights'],
    colorTheme: 'neutral',
  },
  {
    id: 'magic-matrix',
    name: 'Magic Matrix',
    status: 'Closed Testing',
    description: 'A dimensional digital matrix. Restrained green accents, structural intelligence, and systematic transformation.',
    shortDescription: 'Structure, revealed.',
    sectionOrder: 8,
    tags: ['matrix', 'digital', 'closed-testing', 'systematic'],
    colorTheme: 'cool',
  },
  {
    id: 'wah-mahi-ring',
    name: 'Wah Mahi Ring',
    status: 'Research & Development',
    description: 'A luxury ring with metallic reflections. Macro camera movements reveal craftsmanship at its finest.',
    shortDescription: 'Craft, magnified.',
    sectionOrder: 9,
    tags: ['luxury', 'jewelry', 'rd', 'craftsmanship'],
    colorTheme: 'champagne',
  },
  {
    id: 'tracxi-learn',
    name: 'Tracxi Learn',
    status: 'Under Development',
    description: 'Education reimagined. An open book and learning objects that transform how knowledge is acquired and shared.',
    shortDescription: 'Learning, opened.',
    sectionOrder: 10,
    tags: ['education', 'learning', 'development', 'knowledge'],
    colorTheme: 'warm',
  },
  {
    id: 'skillforge',
    name: 'SkillForge',
    status: 'Under Development',
    description: 'Where raw potential meets refined mastery. Anvil, hammer, hot metal, and controlled sparks forge expertise.',
    shortDescription: 'Mastery, forged.',
    sectionOrder: 11,
    tags: ['skills', 'development', 'craft', 'mastery'],
    colorTheme: 'warm',
  },
  {
    id: 'vision-ai',
    name: 'Vision AI',
    status: 'LLM Under Training',
    description: 'An internal AI project based on local computation and private machine-based intelligence. Not a public product.',
    shortDescription: 'Intelligence, localized.',
    sectionOrder: 12,
    isInternal: true,
    tags: ['ai', 'llm', 'local-compute', 'training', 'internal'],
    colorTheme: 'cool',
  },
];

/**
 * Get product by ID
 */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/**
 * Get products by status
 */
export function getProductsByStatus(status: ProductStatus): Product[] {
  return products.filter((p) => p.status === status);
}

/**
 * Get products in section order
 */
export function getProductsInOrder(): Product[] {
  return [...products].sort((a, b) => a.sectionOrder - b.sectionOrder);
}

/**
 * Get published products only
 */
export function getPublishedProducts(): Product[] {
  return products.filter((p) => p.status === 'Published');
}

/**
 * Get public products (exclude internal)
 */
export function getPublicProducts(): Product[] {
  return products.filter((p) => !p.isInternal);
}

/**
 * Status display configuration
 */
export const statusConfig: Record<ProductStatus, { label: string; color: string; description: string }> = {
  'Published': {
    label: 'Published',
    color: 'var(--color-status-published)',
    description: 'Live and available to customers',
  },
  'Under Development': {
    label: 'Under Development',
    color: 'var(--color-status-development)',
    description: 'Actively being built',
  },
  'Under Testing': {
    label: 'Under Testing',
    color: 'var(--color-status-testing)',
    description: 'In testing phase with select users',
  },
  'Closed Testing': {
    label: 'Closed Testing',
    color: 'var(--color-status-closed-testing)',
    description: 'Limited access testing',
  },
  'Research & Development': {
    label: 'Research & Development',
    color: 'var(--color-status-rd)',
    description: 'Early stage exploration',
  },
  'LLM Under Training': {
    label: 'LLM Under Training',
    color: 'var(--color-status-training)',
    description: 'Model training in progress',
  },
};

/**
 * Founder data
 */
export interface Founder {
  id: string;
  name: string;
  title: string;
  bio: string;
  shortBio: string;
  associatedProducts: string[];
  portfolioUrl?: string;
  imageUrl?: string;
  order: number;
}

export const founders: Founder[] = [
  {
    id: 'suresh-bodepudi',
    name: 'Suresh Bodepudi',
    title: 'Founder, Tracxi by Suresh B',
    bio: 'The visionary behind Tracxi by Suresh B — the product that started the entire journey. With deep expertise in logistics and supply chain operations, Suresh built the foundation that the Tracxi ecosystem stands on today.',
    shortBio: 'Founder of the product that started it all.',
    associatedProducts: ['tracxi-by-suresh-b'],
    order: 1,
  },
  {
    id: 'varun-teja-bodepudi',
    name: 'Varun Teja Bodepudi',
    title: 'Founder, Tracxi Parent Company',
    bio: 'Driving the parent-company vision and expansion of the Tracxi product ecosystem. Focused on products spanning logistics, commerce, finance, learning, and technology — building multiple products under one unified vision.',
    shortBio: 'Architect of the multi-product ecosystem.',
    associatedProducts: ['tracxi-2', 'vcx-mart', 'trackspense', 'magic-matrix', 'wah-mahi-ring', 'tracxi-learn', 'skillforge', 'vision-ai'],
    portfolioUrl: 'https://varuntejabodepudi.netlify.app',
    order: 2,
  },
];

export function getFounderById(id: string): Founder | undefined {
  return founders.find((f) => f.id === id);
}

export function getFoundersInOrder(): Founder[] {
  return [...founders].sort((a, b) => a.order - b.order);
}

/**
 * Section order configuration
 */
export const sectionOrder = [
  'hero',
  'meet-our-founders',
  'one-company-multiple-products',
  'tracxi-by-suresh-b',
  'tracxi-2',
  'vcx-mart',
  'trackspense',
  'magic-matrix',
  'wah-mahi-ring',
  'tracxi-learn',
  'skillforge',
  'vision-ai',
  'closing-experience',
] as const;

export type SectionId = (typeof sectionOrder)[number];

/**
 * Get section index for ordering
 */
export function getSectionIndex(sectionId: SectionId): number {
  return sectionOrder.indexOf(sectionId);
}

/**
 * Logo configuration - ONLY ONE LOGO ALLOWED
 */
export const logoConfig = {
  url: 'https://res.cloudinary.com/dfisnbg4l/image/upload/v1795631828/657f5924-f124-48e5-8a7d-c85abc68a415.png',
  alt: 'Tracxi Parent Company Logo',
  width: 120,
  height: 40,
};

/**
 * Company statement
 */
export const companyStatement = 'One company. Multiple products. One vision.';

/**
 * Special transition content for SkillForge
 */
export const skillforgeTransition = {
  triggerSection: 'tracxi-learn',
  text: 'And this is where things get interesting.',
  description: 'Intentional storytelling moment before SkillForge reveal',
};

/**
 * Navigation items for the main nav
 */
export const navItems = [
  { id: 'founders', label: 'Founders', sectionId: 'meet-our-founders', order: 1 },
  { id: 'products', label: 'Products', sectionId: 'one-company-multiple-products', order: 2 },
] as const;