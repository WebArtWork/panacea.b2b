import contactsData from '../../../data/contact/contacts.json';

/**
 * Contacts edited in the market admin (Налаштування → Контакти) and baked into
 * `src/data/contact/contacts.json` by the deploy worker. Only the `b2b` ones are shown here.
 */
export interface Contact {
	id: number;
	platform: 'market' | 'b2b';
	type: ContactType;
	/** Who the contact belongs to; entries sharing name and role are grouped. */
	name: string;
	role: string;
	value: string;
	header?: boolean;
	order: number;
}

export type ContactType =
	| 'phone'
	| 'email'
	| 'address'
	| 'website'
	| 'instagram'
	| 'facebook'
	| 'telegram'
	| 'viber'
	| 'whatsapp'
	| 'tiktok'
	| 'youtube';

export interface ContactGroup {
	name: string;
	role: string;
	contacts: Contact[];
}

const SOCIAL_TYPES: ContactType[] = ['instagram', 'facebook', 'telegram', 'viber', 'whatsapp', 'tiktok', 'youtube'];
const LABELS: Record<ContactType, string> = {
	phone: 'Телефон',
	email: 'Email',
	address: 'Адреса',
	website: 'Сайт',
	instagram: 'Instagram',
	facebook: 'Facebook',
	telegram: 'Telegram',
	viber: 'Viber',
	whatsapp: 'WhatsApp',
	tiktok: 'TikTok',
	youtube: 'YouTube',
};

export const B2B_CONTACTS = (contactsData as Contact[])
	.filter((contact) => contact.platform === 'b2b')
	.sort((a, b) => a.order - b.order || a.id - b.id);

export const B2B_CONTACT_GROUPS = groupContacts(B2B_CONTACTS);

// The phone and social links for the topbar: the ones marked "Шапка" in admin, or, while none are
// marked yet, the first phone and every social network.
const HEADER_CONTACTS = B2B_CONTACTS.some((contact) => contact.header)
	? B2B_CONTACTS.filter((contact) => contact.header)
	: B2B_CONTACTS;

export const B2B_PHONE = HEADER_CONTACTS.find((contact) => contact.type === 'phone');
export const B2B_SOCIALS = HEADER_CONTACTS.filter(isSocialContact);

export function isSocialContact(contact: Pick<Contact, 'type'>): boolean {
	return SOCIAL_TYPES.includes(contact.type);
}

/** What the visitor sees: the value itself, except social links, which show the network's name. */
export function contactText(contact: Pick<Contact, 'type' | 'value'>): string {
	if (isSocialContact(contact)) {
		return LABELS[contact.type];
	}

	return contact.type === 'website'
		? contact.value.replace(/^https?:\/\//, '').replace(/\/$/, '')
		: contact.value;
}

/** Link target for the contact, or '' when it is plain text (an address). */
export function contactHref(contact: Pick<Contact, 'type' | 'value'>): string {
	const value = contact.value.trim();
	const digits = value.replace(/\D/g, '');
	const url = /^https?:\/\//.test(value) ? value : `https://${value}`;

	switch (contact.type) {
		case 'phone':
			return digits ? `tel:${value.startsWith('+') ? '+' : ''}${digits}` : '';
		case 'email':
			return value ? `mailto:${value}` : '';
		case 'viber':
			return digits ? `viber://chat?number=%2B${digits}` : '';
		case 'whatsapp':
			return digits ? `https://wa.me/${digits}` : '';
		case 'telegram':
			return /^https?:\/\//.test(value) ? value : `https://t.me/${value.replace(/^@/, '')}`;
		case 'address':
			return '';
		default:
			return value ? url : '';
	}
}

/** Links to other sites open in a new tab; tel: and mailto: do not. */
export function isExternalContact(contact: Pick<Contact, 'type'>): boolean {
	return contact.type !== 'phone' && contact.type !== 'email' && contact.type !== 'address';
}

function groupContacts(contacts: Contact[]): ContactGroup[] {
	const groups = new Map<string, ContactGroup>();

	for (const contact of contacts) {
		const key = `${contact.name}|${contact.role}`;
		const group = groups.get(key) ?? { name: contact.name, role: contact.role, contacts: [] };

		group.contacts.push(contact);
		groups.set(key, group);
	}

	return [...groups.values()];
}
