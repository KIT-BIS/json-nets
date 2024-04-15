import { getNetInstance } from "@/json-nets/Net";
import { defineStore } from "pinia"
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
	TitleComponent,
	TooltipComponent,
	LegendComponent
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import { usePlacesStore } from "./place";

use([TitleComponent, TooltipComponent, LegendComponent, PieChart, SVGRenderer])

export type SunburstOption = {
}
// export type PieOption = {
// }
export type SankeyOption = {}

// Todo: this is doubled here => move to util library
function roundToSix(num: number) {

	return +(Math.round(Number(String(num) + 'e+6')) + 'e-6');
}

/**
 * Provides state for visualisations.
 * Todo: currently very hacky and scope3tool-specific. Should be reworked into general concept.
 */
export const useIndicatorStore = defineStore('indicator', {
	state: () => {
		return {
			visualisationData: "" as any,
			// indicatorValue: "<keine Daten>" as string,
			// indicatorType: 'pcf-sunburst' as string,

			// customIndicatorType: 'number' as 'sunburst' | 'sankey' | 'pie' | 'number',
			// valuePath: '/0/number' as string,
			// value: false as any,


			numberData: {

			},
			sunburstData: {
			} as SunburstOption,
			// pieOption: {
			// } as PieOption,
			sankeyData: {
			} as SankeyOption 
		}
	},
	actions: {
		setVisualisationData(visualisationData: any) {
			this.visualisationData = visualisationData;
			if (visualisationData.type === "number") {
				this.numberData = visualisationData.description + ": " + visualisationData.value + " " + visualisationData.unit;
			} else if (visualisationData.type === "sunburst") {
				/**
				 * Sunburst expects value of type [
				 * { 
				 * 		name: "1st level name"
				 * 		children: [
				 * 			{
				 * 				"name": "some name"
				 * 				"value": 5
				 * 			}
				 * 		]
				 * }
				 * ]
				 */

				this.sunburstData = this.compileSunburstOption(visualisationData.value, '{b}: {c} ' + visualisationData.unit, visualisationData.description);
			} else if (visualisationData.type === "sankey") {
				/**
				 * Sankey expects value of type { data: Array<{ name: <string> }>, links: Array<{source: <string>, target: <string>, value: <number>}>}
				 */
				this.sankeyData = this.compileSankeyOption(visualisationData.value, '{a} {b} {c} {d} {e}');
			}
		},
		compileSunburstOption(data: any, formatter: string | Function, title: string, sanitize = true): SunburstOption {
			if (sanitize) {
				// let sanitizedData = [];
				for (let i = 0; i < data.length; i++) {
					let sanitizedEntry = this.processContributions(data[i].children);
					data[i].children = sanitizedEntry;
					// sanitizedData.push(sanitizedEntry);
				}
				// data = sanitizedData;
			}
			let option = {
				title: {
					text: title,
					left: 'center',
				},
				tooltip: {
					trigger: 'item',
					formatter: formatter,
				},
				legend: {
					orient: 'vertical',
					left: 'left',
					data: [] as Array<string>,
				},
				series: [{
					name: title,
					// radius: '55%',
					center: ['50%', '50%'],
					type: 'sunburst',
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)',
						},
					},
					data: data,
					radius: [60, '80%'],
				}]
			}
			return option;
		},
		compileSankeyOption(data: any, formatter: string | Function, sanitize = true) {
			let option = {
				series: {
					type: 'sankey',
					layout: 'none',
					nodeAlign: 'right',
					label: {
						normal: {
							formatter: formatter  // {b} is the node name
						}
					},
					emphasis: {
						focus: 'adjacency'
					},
					data: sanitize? this.removeDuplicates(data.data) : data.data,
					links: data.links
				}
			};
			return option;
		},
		// roundToTwo(num: number) {
			// return +(Math.round(Number(String(num) + 'e+2')) + 'e-2');
		// },
		// echarts expects unique names, which may not be the case in provided data
		// this function adds up values with same names (could be solved in transition inscriptions instead)
		processContributions(arrayOfContribs: Array<{ name: string, value: number }>): Array<{ name: string, value: number }> {
			const returnArray = [] as Array<{ name: string, value: number }>;

			for (let i = 0; i < arrayOfContribs.length; i++) {
				const contrib = arrayOfContribs[i];
				if (!returnArray.find((el) => el.name == contrib.name)) {
					// if name doesn't exist, create new entry in return Array
					returnArray.push(contrib);
				} else {
					//else add up values
					const entry = returnArray.find((el) => el.name == contrib.name)!;
					entry.value += contrib.value
				}
			}
			return returnArray;
		},
		// same as for processContributions: enforce unique names (could be solved in transition inscriptions instead)
		removeDuplicates(data: Array<any>) {
			const returnArray = data.filter((value, index, self) =>
				index === self.findIndex((t) => (t.name === value.name))
			);
			return returnArray;

		},
//		updateIndicator() {
//			const placeData = getNetInstance().findPlace(usePlacesStore().place.id)
//			if (placeData) {
//				const content = <{
//					ghgFactor: number,
//					amount: number,
//					pds: number,
//					type: string,
//					footprintContributions: Array<{ name: string, value: number }>,
//					names: Array<string>,
//					sankeyNodes: Array<any>,
//					sankeyLinks: Array<any>
//				}>placeData.marking[0];
//
//				if (this.indicatorType === 'pcf-sunburst') {
//					//@ts-ignore
//					if (content && content.footprintContributions) {
//						this.indicatorValue = this.roundToTwo(content.ghgFactor * content.amount) + " kg CO2e";
//						//@ts-ignore
//						this.sunburstOption.series[0].data[0].children = this.processContributions(content.footprintContributions[1]);
//						//@ts-ignore
//						this.sunburstOption.series[0].data[1].children = this.processContributions(content.footprintContributions[2]);
//						//@ts-ignore
//						this.sunburstOption.series[0].data[2].children = this.processContributions(content.footprintContributions[3]);
//					} else {
//						this.pieOption.series[0].data = [];
//						this.indicatorValue = "<keine Daten>";
//
//					}
//
//
//				} else if (this.indicatorType === 'pcf-sankey') {
//					//@ts-ignore
//					if (content && content.footprintContributions) {
//						this.indicatorValue = this.roundToTwo(content.ghgFactor * content.amount) + " kg CO2e";
//						this.sankeyOption.series.data = this.removeDuplicates(content.sankeyNodes);
//						this.sankeyOption.series.links = content.sankeyLinks;
//					} else {
//						this.sankeyOption.series.data = [];
//						this.sankeyOption.series.links = [];
//						this.indicatorValue = "<keine Daten>";
//
//					}
//				} else if (this.indicatorType === 'pds') {
//					if (content) {
//						this.indicatorValue = Math.round(content.pds * 100) + "% Primärdaten";
//					} else {
//						this.indicatorValue = "<keine Daten>";
//					}
//				}
//			}
//		}
	}
})