<script>
</script>

<style>
	.wrapper {
		max-width: 1080px;
		margin: 30px auto 33vh;
	}

	.grid-container {
		margin: 30px;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-column-gap: 30px;
		grid-row-gap: 30px;
		grid-auto-flow: row dense;
	}

	header {
		grid-column-start: 1;
		grid-column-end: 4;
	}

	header h1 {
		font-size: 73px;
		margin: 30px 0 20px;
		font-family: 'Lexend', sans-serif;
		font-weight: unset;
		text-align: center;
		color: rgb(23, 29, 32);
	}

	.grid-item img {
		width: 100%;
		box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
	}

	a img:hover {
		position: relative;
		box-shadow: 0px 1px 10px 0px rgba(0,0,0,0.5);
	}

	.grid-item .description {
		display: block;
		margin: 6px;
		font-size: 12.5px;
		color: rgb(127, 130, 138);
		text-align: center;
	}

	.about {
		grid-column-start: 1;
		grid-column-end: 4;
		margin: 10px auto 20px;
		padding: 0 10px;
		line-height: 1.5;
		color: #34434B;
		font-size: 16px;
		max-width: 800px;
	}

	@media only screen and (max-width: 800px) {
		.wrapper {
			max-width: 700px;
		}
		
		.grid-container {
			grid-template-columns: 1fr 1fr;
			grid-column-gap: 20px;
			grid-row-gap: 20px;
			margin: 20px;
		}

		header {
			grid-column-start: 1;
			grid-column-end: 3;
		}

		header h1 {
			font-size: 58px;
		}

		.about {
			max-width: 700px;
			grid-column-start: 1;
			grid-column-end: 3;
			font-size: 15px;
		}
	}

	@media only screen and (max-width: 400px) {
		.about {
			padding: 0;
		} 
	}
</style>

<svelte:head>
	<title>Gefylen</title>
</svelte:head>

<div class="wrapper">
	<div class="grid-container">
		<header>
			<h1>Gefylen</h1>
		</header>

		<div class="grid-item">
			<img src="placeholder.png" />
			<span class="description">Time and the solar system</span>
		</div>
		<div class="grid-item">
			<img src="placeholder.png" />
			<span class="description">Global population and CO2 footprint</span>
		</div>
		
		<div class="about">
			<p>Gefylen is me, Gorm, a freelance data visualization tinkerer. I work to make data explorable and intuitively accessible with interactive graphs, maps and diagrams. My primary tool is the JavaScript library <a href="https://d3js.org/">D3</a>.</p>
			
			<p>I live in Trondheim, Norway, but can work remotely. I'm fluent in English. Contact me on <a href="mailto:gorm@gefylen.dev">gorm@gefylen.dev</a> or <a href="https://twitter.com/gefylen">@gefylen</a>.</p>
		</div>
		<div class="grid-item">
			<img src="placeholder.png" />
			<span class="description">Student flow analytics</span>
		</div>
		<div class="grid-item">
			<a href="/starmap">
				<img src="starmap320.png" />
			</a>
			<span class="description">Habitable planets within 100 light-years</span>
		</div>
		<div class="grid-item">
			<img src="placeholder.png" />
			<span class="description">Rate of growth explainer</span>
		</div>
	</div>
</div>