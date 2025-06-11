import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

type TMarkdownRendererProps = {
	content: string;
};

export default function MarkdownRenderer({ content }: TMarkdownRendererProps) {
	return (
		<ReactMarkdown
			components={{
				h1: ({ node, ...props }) => (
					<h1
						className="mt-8 mb-4 text-3xl font-semibold md:text-5xl"
						{...props}
					/>
				),
				h2: ({ node, ...props }) => (
					<h2
						className="mt-6 mb-3 text-2xl font-semibold md:text-3xl"
						{...props}
					/>
				),
				h3: ({ node, ...props }) => (
					<h3
						className="mt-5 mb-3 text-xl font-semibold md:text-2xl"
						{...props}
					/>
				),
				h4: ({ node, ...props }) => (
					<h4 className="mb-4 font-semibold md:text-lg" {...props} />
				),
				p: ({ node, ...props }) => (
					<p className="mb-4 leading-relaxed" {...props} />
				),
				ul: ({ node, ...props }) => (
					<ul className="mb-4 list-disc pl-6" {...props} />
				),
				ol: ({ node, ...props }) => (
					<ol className="mb-4 list-decimal pl-6" {...props} />
				),
				li: ({ node, ...props }) => <li className="mb-1" {...props} />,
				strong: ({ node, ...props }) => (
					<strong className="font-semibold" {...props} />
				),
				a: ({ node, ...props }) => (
					<a
						className="text-blue-500 hover:text-blue-600 hover:underline"
						target="_blank"
						rel="noopener noreferrer"
						{...props}
					/>
				),
				table: ({ node, ...props }) => (
					<div className="mb-4 overflow-x-auto">
						<table
							className="w-full border-collapse border border-gray-300 text-sm"
							{...props}
						/>
					</div>
				),
				thead: ({ node, ...props }) => (
					<thead className="bg-gray-100 text-left" {...props} />
				),
				tbody: ({ node, ...props }) => <tbody {...props} />,
				tr: ({ node, ...props }) => (
					<tr className="border-b border-gray-300" {...props} />
				),
				th: ({ node, ...props }) => (
					<th className="border border-gray-300 p-2 font-semibold" {...props} />
				),
				td: ({ node, ...props }) => (
					<td className="border border-gray-300 p-2" {...props} />
				)
			}}
			remarkPlugins={[remarkGfm]}
		>
			{content}
		</ReactMarkdown>
	);
}
