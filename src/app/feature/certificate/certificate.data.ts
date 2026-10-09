import certificatesData from '../../../data/certificate/certificates.json';

/**
 * Documents edited in the market admin (Налаштування → Документи) and baked into
 * `src/data/certificate/certificates.json` by the deploy worker.
 */
export interface Certificate {
	id: number;
	title: string;
	description: string;
	meta: string;
	format: string;
	/** Absolute for uploads; `/docs/...` for files shipped with the market site. */
	url: string;
	fileName: string;
	order: number;
}

/** Files shipped with the market site live there, not on this one. */
const MARKET_ORIGIN = 'https://market.zbruchanskidzherela.com.ua';
const IMAGE_FORMATS = ['JPG', 'PNG', 'WEBP'];

export const CERTIFICATES = (certificatesData as Certificate[])
	.map((certificate) => ({
		...certificate,
		url: certificate.url.startsWith('/') ? `${MARKET_ORIGIN}${certificate.url}` : certificate.url,
	}))
	.sort((a, b) => a.order - b.order || a.id - b.id);

export function isImageCertificate(certificate: Pick<Certificate, 'format'>): boolean {
	return IMAGE_FORMATS.includes(certificate.format);
}

/** Images and PDFs open in the browser; Word files can only be downloaded. */
export function canPreviewCertificate(certificate: Pick<Certificate, 'format'>): boolean {
	return isImageCertificate(certificate) || certificate.format === 'PDF';
}
