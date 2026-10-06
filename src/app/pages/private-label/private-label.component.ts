import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	imports: [NgOptimizedImage, RouterLink],
	templateUrl: './private-label.component.html',
	styleUrl: './private-label.component.scss',
})
export class PrivateLabelComponent {}
