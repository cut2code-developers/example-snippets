const debounce = (func, wait) => {
	let timeout;
	return function executedFunction (...args) {
		return new Promise((resolve, reject) => {
			const later = () => {
				clearTimeout(timeout);
				try {
					resolve(func(...args));
				} catch (e) {
					reject(e);
				}
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		});
	};
};

const isElementInViewport = element => {
	return new Promise(resolve => {
		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				resolve(entry.isIntersecting);
			});
		});
		observer.observe(element);
	});
};

const handleMatterTags = () => {
	const matterTagsBlocks = Array.from(document.querySelectorAll('.matter-tags'));
	if (!matterTagsBlocks.length) return;

	matterTagsBlocks.forEach(matterTag => {
		const isMobile = window.matchMedia('(max-width: 600px)').matches;

		const splitWords = () => {
			const textNode = matterTag.querySelector('.matter-tags__tags');
			const tagsData = matterTag.querySelector('.matter-tags__tags-data');
			const tagsDataArray = JSON.parse(tagsData.value);

			textNode.innerHTML = tagsDataArray.map(item => `<span style='background-color:${item.bg}; color:${item.color}' class='matter-tags__tag show'>${item.title}</span>`).join('');
		};

		splitWords();

		const wordElements = Array.from(matterTag.querySelectorAll('.matter-tags__tag')); // Cache the results here

		const renderCanvas = () => {
			const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

			const params = {
				isStatic: false,
				render: {
					fillStyle: 'transparent',
				},
			};
			const canvasSize = {
				width: matterTag.offsetWidth,
				height: matterTag.offsetHeight + 30,
			};
			const engine = Engine.create({
				gravity: {
					x: 0,
					y: 0.6,
				},
			});

			const render = Render.create({
				element: matterTag,
				engine,
				pixelRatio: 0.5,
				options: {
					...canvasSize,
					background: 'transparent',
					wireframes: false,
					bounds: null,
				},
			});

			const createBody = (x, y, width, height, params) => Bodies.rectangle(x, y, width, height, {
				...params,
				isStatic: true,
			});

			let floor = createBody(canvasSize.width / 2, canvasSize.height, canvasSize.width, 50, params);
			let wallLeft = createBody(0, canvasSize.height / 2, 50, canvasSize.height, params);
			let wallRight = createBody(canvasSize.width, canvasSize.height / 2, 50, canvasSize.height, params);
			const top = createBody(canvasSize.width / 2, -55, canvasSize.width, 90, params);

			if (isMobile) {
				floor = createBody(canvasSize.width / 2, canvasSize.height, canvasSize.width, 55, params);
				wallLeft = createBody(0, canvasSize.height / 2, 10, canvasSize.height, params);
				wallRight = createBody(canvasSize.width, canvasSize.height / 2, 20, canvasSize.height, params);
			}

			const mouse = Mouse.create(matterTag);
			const mouseConstraint = MouseConstraint.create(engine, {
				mouse,
				constraint: {
					stiffness: 0.2,
					render: {
						visible: true,
					},
				},
			});

			World.add(engine.world, [
				floor,
				wallLeft,
				wallRight,
				mouseConstraint,
			]);

			render.mouse = mouse;
			Runner.run(engine);
			Render.run(render);

			mouseConstraint.mouse.element.removeEventListener('mousewheel', mouseConstraint.mouse.mousewheel);
			mouseConstraint.mouse.element.removeEventListener('DOMMouseScroll', mouseConstraint.mouse.mousewheel);

			const wordBodies = wordElements.reduce((acc, elemRef, i) => {
				const { offsetWidth: width, offsetHeight: height } = elemRef;

				if (isMobile && i >= 10) {
					return acc;
				}

				const body = Bodies.rectangle(
					Math.random() * (canvasSize.width - width) + width / 2,
					height / 2 - 90,
					width,
					height,
					{
						...params,
						restitution: 0.5,
						friction: 0.5,
						collisionFilter: {
							category: 0x0001,
						},
					}
				);

				requestAnimationFrame(() => {
					World.add(engine.world, body);
				}, i * 80);

				acc.push({
					body,
					elem: elemRef,
					render() {
						const { position, angle } = this.body;
						const { x, y } = position;
						this.elem.style.transform = `translate(${x - width / 2}px, ${y - height / 2}px) rotate(${angle}rad)`;
						this.elem.style.opacity = '1';
					},
				});

				return acc;
			}, []);

			// Set a timeout for adding roof after falling pills
			setTimeout(() => {
				World.add(engine.world, top);
			}, 1000);

			const rerender = () => {
				wordBodies.forEach(element => {
					const { position, angle } = element.body;
					const { x, y } = position;
					element.x = x;
					element.y = y;
					element.angle = angle;
					element.width = element.elem.offsetWidth;
					element.height = element.elem.offsetHeight;
				});
				requestAnimationFrame(() => {
					wordBodies.forEach(element => {
						element.elem.style.transform = `translate(${element.x - element.width / 2}px, ${element.y - element.height / 2}px) rotate(${element.angle}rad)`;
						element.elem.style.opacity = '1';
					});
				});
				Matter.Engine.update(engine);
				requestAnimationFrame(rerender);
			};

			rerender();
		};
		const handleScroll = debounce(async () => {
			const isInViewport = await isElementInViewport(matterTag);
			if (matterTag.classList.contains('active') || !isInViewport) {
				return;
			}

			matterTag.classList.add('active');
			requestAnimationFrame(renderCanvas);
		}, 200);

		isElementInViewport(matterTag).then(isInViewport => {
			if (isInViewport) {
				handleScroll();
			} else {
				document.addEventListener('scroll', handleScroll);
			}
		});
	});
};

window.addEventListener('DOMContentLoaded', handleMatterTags);

if (window.acf) {
	window.acf.addAction('render_block_preview/type=acf-matter-tags', handleMatterTags);
}