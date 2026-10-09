import { NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { canPreviewCertificate, CERTIFICATES, isImageCertificate } from '../../feature/certificate/certificate.data';
import { B2B_PHONE, B2B_SOCIALS, contactHref, contactText } from '../../feature/contact/contact.data';

@Component({
	selector: 'app-topbar',
	imports: [NgOptimizedImage, RouterLink],
	host: { '(document:keydown.escape)': 'closeCertificates()' },
	templateUrl: './topbar.component.html',
	styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
	protected readonly menuOpen = signal(false);
	protected readonly certificatesOpen = signal(false);
	// Admin Налаштування → Документи / Контакти, as baked in at deploy time.
	protected readonly documents = CERTIFICATES;
	protected readonly phone = B2B_PHONE;
	protected readonly socials = B2B_SOCIALS;
	protected readonly isImage = isImageCertificate;
	protected readonly canPreview = canPreviewCertificate;
	protected readonly contactHref = contactHref;
	protected readonly contactText = contactText;
	protected toggleMenu() { this.menuOpen.update((open) => !open); }
	protected closeMenu() { this.menuOpen.set(false); }
	protected openCertificates(event: Event) {
		event.preventDefault();
		this.menuOpen.set(false);
		this.certificatesOpen.set(true);
	}
	protected closeCertificates() { this.certificatesOpen.set(false); }
}
