import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

/** A document from the market admin "Документи" list, published at `market/documents.json`. */
interface CertificateDocument {
	title: string;
	format: string;
	url: string;
	fileName: string;
}

const DOCUMENTS_URL = 'https://market.zbruchanskidzherela.com.ua/documents.json';
const IMAGE_FORMATS = ['JPG', 'PNG', 'WEBP'];

/** Shown until the list loads, and when it can't (offline, market down). */
const FALLBACK_DOCUMENTS: CertificateDocument[] = [
	{ title: 'PANACEA Arden', format: 'JPG', url: '/certificates/certificate-arden.jpg', fileName: 'certificate-arden.jpg' },
	{ title: 'PANACEA Diamond', format: 'JPG', url: '/certificates/certificate-diamond.jpg', fileName: 'certificate-diamond.jpg' },
	{
		title: 'Медичний бальнеологічний висновок №492',
		format: 'PDF',
		url: '/certificates/medical-balneological-conclusion-492-2016.pdf',
		fileName: 'medical-balneological-conclusion-492-2016.pdf',
	},
];

@Component({
	selector: 'app-topbar',
	imports: [NgOptimizedImage, RouterLink],
	host: { '(document:keydown.escape)': 'closeCertificates()' },
	templateUrl: './topbar.component.html',
	styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private _loaded = false;

	protected readonly menuOpen = signal(false);
	protected readonly certificatesOpen = signal(false);
	protected readonly documents = signal(FALLBACK_DOCUMENTS);
	protected toggleMenu() { this.menuOpen.update((open) => !open); }
	protected closeMenu() { this.menuOpen.set(false); }
	protected openCertificates(event: Event) {
		event.preventDefault();
		this.menuOpen.set(false);
		this.certificatesOpen.set(true);
		void this._loadDocuments();
	}
	protected closeCertificates() { this.certificatesOpen.set(false); }
	protected isImage(document: CertificateDocument) { return IMAGE_FORMATS.includes(document.format); }
	protected canPreview(document: CertificateDocument) { return this.isImage(document) || document.format === 'PDF'; }

	private async _loadDocuments() {
		if (!this._isBrowser || this._loaded) {
			return;
		}

		this._loaded = true;

		try {
			const response = await fetch(DOCUMENTS_URL);
			const documents = (await response.json()) as CertificateDocument[];

			if (response.ok && Array.isArray(documents) && documents.length) {
				this.documents.set(documents);
			}
		} catch {
			// Keep the bundled fallback list.
		}
	}
}
