import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2 } from 'lucide-react';
import MarkdownRenderer from '@/components/ui/markdown';

interface AiSuggestionsProps {
	batchId?: string;
	productionId?: string;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({
	batchId,
	productionId
}) => {
	const [suggestions, setSuggestions] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchSuggestions = async () => {
		if (!batchId && !productionId) return;

		setIsLoading(true);
		setError(null);

		try {
			// Determine the appropriate endpoint based on which ID is provided
			const endpoint = batchId
				? `/api/batches/${batchId}/ai-suggestions`
				: `/api/admin/production/${productionId}/ai-suggestions`;

			const response = await fetch(endpoint);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || 'Failed to fetch AI suggestions');
			}

			const data = await response.json();
			setSuggestions(data.suggestions);
		} catch (err) {
			console.error('Error fetching AI suggestions:', err);
			setError(
				err instanceof Error ? err.message : 'An unknown error occurred'
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="mt-6">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div className="space-y-1">
					<CardTitle className="flex items-center text-lg font-medium">
						<Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
						AI Production Insights
					</CardTitle>
					<CardDescription>
						Get AI-powered suggestions and analysis for this production batch
					</CardDescription>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={fetchSuggestions}
					disabled={isLoading || (!batchId && !productionId)}
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Analyzing...
						</>
					) : (
						'Generate Insights'
					)}
				</Button>
			</CardHeader>
			<CardContent>
				{error && (
					<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
						{error}
					</div>
				)}

				{suggestions && (
					<div className="prose prose-sm dark:prose-invert max-w-none">
						<MarkdownRenderer content={suggestions} />
					</div>
				)}

				{!suggestions && !isLoading && !error && (
					<div className="text-muted-foreground py-8 text-center text-sm italic">
						Click &ldquo;Generate Insights&rdquo; to get AI-powered suggestions
						for this production batch
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default AiSuggestions;
