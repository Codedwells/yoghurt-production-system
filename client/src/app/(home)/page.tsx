'use client';

import MyCookieConsent from '@/hooks/use-cookie-consent';

export default function Home() {
	return (
		<>
			<MyCookieConsent />
			<main className="flex min-h-screen flex-col items-center justify-between p-24">
				Hello from Yorghurt
			</main>
		</>
	);
}
