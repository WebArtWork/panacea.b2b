import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { B2B_CONTACT_GROUPS, contactHref, contactText, isExternalContact } from '../../feature/contact/contact.data';

@Component({
	selector: 'app-footer',
	imports: [NgOptimizedImage, RouterLink],
	templateUrl: './footer.component.html',
	styles: `.footer-title { font-size: .7rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; } a { transition: opacity .2s ease; } a:hover { opacity: .65; } @media (min-width: 768px) { .footer-title { font-size: .82rem; } }`,
})
export class FooterComponent {
	protected readonly currentYear = new Date().getFullYear();
	// Admin Налаштування → Контакти, as baked in at deploy time.
	protected readonly groups = B2B_CONTACT_GROUPS;
	protected readonly href = contactHref;
	protected readonly text = contactText;
	protected readonly external = isExternalContact;
}
