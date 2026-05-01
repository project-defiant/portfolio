export const siteConfig = {
	identity: {
		brand: 'PROJECT-DEFIANT',
		owner: 'Szymon Szyszkowski',
		displayName: 'PROJECT-DEFIANT (Szymon Szyszkowski)',
		tagline: 'Where no man has code before...',
		description:
			'Project Defiant is Szymon Szyszkowski’s life science and programming outpost for writing, resume, and portfolio work.',
	},
	metadata: {
		siteUrl: 'https://project-defiant.github.io/',
locale: 'en_US',
themeColor: '#0a0c10',
defaultImage: '/social-card.svg',
twitterHandle: '@SSzyszkowski',
},
navigation: [
{ href: '/', label: 'Home' },
{ href: '/about', label: 'About' },
{ href: '/resume', label: 'Resume' },
{ href: '/blog', label: 'Blog' },
],
externalLinks: [
{ href: 'https://github.com/project-defiant', label: 'GitHub' },
{
href: 'https://www.linkedin.com/in/szymon-szyszkowski-bb3762182',
label: 'LinkedIn',
},
{ href: 'https://x.com/SSzyszkowski', label: 'X' },
{ href: 'mailto:szymonszyszkowski@gmail.com', label: 'Email' },
],
};

export function getPageTitle(pageTitle) {
return pageTitle ? `${pageTitle} | ${siteConfig.identity.brand}` : siteConfig.identity.brand;
}

export function getPageDescription(description) {
return description ?? siteConfig.identity.description;
}
