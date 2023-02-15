import { ReactNode } from "react";

interface LayoutProps {
	children?: ReactNode | undefined;
	className?: string;
	star: Star;
}

class Star {
	x: number;
	y: number;
	z: number;
	radius: number;
	size: number;
	opacity: number;
	constructor() {
		this.x = Math.random() * 100; // x coordinate
		this.y = Math.random() * 100; // y coordinate
		this.z = Math.random() * 100; // distance
		this.radius = Math.random() * 6;
		this.size = Math.PI * Math.pow(this.radius, 2);
		this.opacity = (this.z * this.size) / 10000;
	}

	style = function (): object {
		return {
			right: this.x + "%",
			bottom: this.y + "%",
			opacity: this.opacity,
			width: this.radius,
			height: this.radius,
		};
	};
}
// TODO: recompute it with getStaticProps
// TODO: add interactivity
const stars = Array.from({ length: 500 }, (_, i) => i).map(() => new Star());

const StarComponent = function (props: LayoutProps) {
	return (
		<div
			className={
				"rounded-full bg-test3 absolute flex justify-center items-center"
			}
			style={props.star.style()}
		></div>
	);
};

const BackgroundContainer = function () {
	return (
		<div className="bg-background absolute inset-0 -z-50 ">
			<div className="absolute inset-0 -z-50">
				{stars.map((elem, idx) => (
					<StarComponent key={`star${idx}`} star={elem} />
				))}
			</div>
		</div>
	);
};

export default BackgroundContainer;
