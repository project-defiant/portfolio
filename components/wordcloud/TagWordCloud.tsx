"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

interface TagData {
	text: string;
	size: number;
	count: number;
}

interface TagWordCloudProps {
	tags: string[];
	onTagClick?: (tag: string) => void;
	selectedTag?: string;
}

interface CloudWord {
	text: string;
	size: number;
	count: number;
	x?: number;
	y?: number;
	rotate?: number;
}

// Seeded random number generator for deterministic layout
function seededRandom(seed: number) {
	return function() {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
}

// Generate a deterministic seed from a string
function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return Math.abs(hash);
}

export default function TagWordCloud({ tags, onTagClick, selectedTag }: TagWordCloudProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

	// Count tag occurrences
	const tagCounts = tags.reduce((acc: Record<string, number>, tag: string) => {
		acc[tag] = (acc[tag] || 0) + 1;
		return acc;
	}, {});

	// Convert to array and sort by count
	const tagData: TagData[] = Object.entries(tagCounts)
		.map(([text, count]) => ({
			text,
			count,
			size: count,
		}))
		.sort((a, b) => b.count - a.count);

	// Update dimensions on resize
	useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				const { width } = containerRef.current.getBoundingClientRect();
				setDimensions({
					width: Math.min(width, 800),
					height: Math.min(width * 0.6, 500),
				});
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	useEffect(() => {
		if (!svgRef.current || tagData.length === 0) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const { width, height } = dimensions;

		// Calculate font size scale based on tag counts
		const maxCount = Math.max(...tagData.map((d) => d.count));
		const minCount = Math.min(...tagData.map((d) => d.count));
		const fontScale = d3
			.scaleLinear()
			.domain([minCount, maxCount])
			.range([16, 60]);

		// Color scale using the site's theme colors
		const colors = ["#46B9EB", "#B3365B", "#3FA4D1", "#B3506E", "#EBCACA"];
		const colorScale = d3.scaleOrdinal(colors);

		// Create a deterministic seed based on all tag names
		const seedString = tagData.map(d => d.text).sort().join(",");
		const seed = hashString(seedString);
		const random = seededRandom(seed);

		// Pre-calculate deterministic rotations for each word
		const wordRotations = new Map<string, number>();
		tagData.forEach((d) => {
			const r = random();
			wordRotations.set(d.text, r > 0.5 ? 0 : (r > 0.25 ? 90 : -90));
		});

		// Create word cloud layout with deterministic random
		const layout = cloud<CloudWord>()
			.size([width, height])
			.words(
				tagData.map((d) => ({
					text: d.text,
					size: fontScale(d.count),
					count: d.count,
				}))
			)
			.padding(5)
			.rotate((d) => wordRotations.get(d.text || "") || 0)
			.random(random)
			.font("Alef")
			.fontSize((d) => d.size || 16)
			.spiral("archimedean")
			.on("end", draw);

		function draw(words: CloudWord[]) {
			const g = svg
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("transform", `translate(${width / 2},${height / 2})`);

			g.selectAll("text")
				.data(words)
				.enter()
				.append("text")
				.style("font-size", (d) => `${d.size}px`)
				.style("font-family", "Alef, sans-serif")
				.style("font-weight", "700")
				.style("fill", (d) => {
					// Highlight selected tag
					if (selectedTag && d.text === selectedTag) {
						return "#46B9EB";
					}
					return colorScale(d.text || "");
				})
				.style("opacity", (d) => {
					// Dim non-selected tags when a tag is selected
					if (selectedTag && d.text !== selectedTag) {
						return 0.4;
					}
					return 1;
				})
				.style("cursor", "pointer")
				.style("transition", "all 0.2s ease")
				.attr("text-anchor", "middle")
				.attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
				.text((d) => d.text || "")
				.on("mouseover", function (event, d) {
					if (selectedTag !== d.text) {
						d3.select(this).style("opacity", 0.7);
					}
				})
				.on("mouseout", function (event, d) {
					if (selectedTag && d.text !== selectedTag) {
						d3.select(this).style("opacity", 0.4);
					} else {
						d3.select(this).style("opacity", 1);
					}
				})
				.on("click", function (event, d) {
					if (onTagClick && d.text) {
						onTagClick(d.text);
					}
				})
				.append("title")
				.text((d) => `${d.text}: ${d.count} post${d.count > 1 ? "s" : ""} (click to filter)`);
		}

		layout.start();
	}, [tagData, dimensions, onTagClick, selectedTag]);

	if (tagData.length === 0) {
		return (
			<div className="flex items-center justify-center h-64 text-font/50">
				No tags available
			</div>
		);
	}

	return (
		<div ref={containerRef} className="w-full flex justify-center">
			<svg ref={svgRef} className="word-cloud" />
		</div>
	);
}
