<!-- Intermodal, transportation information aggregator
    Copyright (C) 2022  Cláudio Pereira

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>. -->
<script>
	import { onMount } from 'svelte';
	import L from 'leaflet?client';
	import { calcRouteMultipoly, stopName } from '$lib/utils.js';
	import { stops } from '$lib/stores.js';

	export let subrouteStops;

	let map;
	let subrouteLayer;

	let selectedStop = null;
	let selectedStopMarker;

	subrouteStops.subscribe(() => {
		if (map) {
			drawSubroute();
		}
	});

	let stopIcon;

	function drawSubroute() {
		if ($subrouteStops === undefined) {
			return;
		}
		let cachedStops = $stops;
		subrouteLayer.removeFrom(map);
		subrouteLayer = L.layerGroup();

		let segments = calcRouteMultipoly($subrouteStops);

		let outerPolyline = L.polyline(segments, {
			color: 'black',
			weight: 6
		}).addTo(subrouteLayer);
		let innerPolyline = L.polyline(segments, {
			color: 'white',
			weight: 4
		}).addTo(subrouteLayer);
		subrouteLayer.addTo(map);
		let bounds = outerPolyline.getBounds();
		if (bounds.isValid()) {
			map.fitBounds(bounds);
		}

		for (let i = 0; i < $subrouteStops.length; i++) {
			let stop = $subrouteStops[i];

			if (stop.lat && stop.lon) {
				let marker = L.marker([stop.lat, stop.lon], { icon: stopIcon });
				marker.on('click', () => {
					selectStop(stop);
				});
				marker.addTo(subrouteLayer);
				marker.bindTooltip(stopName(stop));
				marker.bindPopup(stopName(stop));
			}
		}
	}

	function selectStop(stop) {
		if (stop.lat && stop.lon) {
			map.once('moveend zoomend', () => {
				selectedStop = stop;
			});
			map.setView(new L.LatLng(stop.lat, stop.lon), 16);

			if (selectedStopMarker) {
				selectedStopMarker.removeFrom(map);
			}
			selectedStopMarker = L.marker([stop.lat, stop.lon]);
			selectedStopMarker.addTo(subrouteLayer);
		}
		selectedStop = stop;
	}

	onMount(() => {
		map = L.map('subroute-map', {
			maxBounds: new L.LatLngBounds(new L.LatLng(38.3, -10.0), new L.LatLng(39.35, -8.0)),
			maxBoundsViscosity: 1.0,
			minZoom: 10
		}).setView([38.71856, -9.1372], 10);

		L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			maxZoom: 19,
			subdomains: ['a', 'b'],
			attribution: '© OpenStreetMap e contribuidores'
		}).addTo(map);

		stopIcon = L.icon({
			iconUrl: `/markers/bus-minimal.svg`,
			iconSize: [16, 16],
			iconAnchor: [8, 8]
		});
		subrouteLayer = L.layerGroup();

		map.on('movestart', () => {
			selectedStop = undefined;
			if (selectedStopMarker) {
				selectedStopMarker.removeFrom(map);
			}
		});

		L.control.scale().addTo(map);
		drawSubroute();
	});
</script>

<div id="subroute-map" class="w-full" style="height: max(80vh, 20rem)" />

<style>
	@import 'leaflet/dist/leaflet.css';
	@import 'leaflet.markercluster/dist/MarkerCluster.css';
</style>
