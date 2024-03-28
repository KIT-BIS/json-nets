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
			indicatorValue: "<keine Daten>" as string,
			indicatorType: 'pcf-sunburst' as string,

			sunburstOption: {
				title: {
					text: 'Beiträge',
					left: 'center',
				},
				tooltip: {
					trigger: 'item',
					// formatter: '{a} <br/>{b} : {c} ({d}%)',
					formatter: (params: any) => {
						const value = roundToSix(params.data.value)
						if (params.name === "Beiträge") {
							return "zurück";
						}
						return `${params.data.name} : ${value} kgCO2eq`;
					},
				},
				legend: {
					orient: 'vertical',
					left: 'left',
					data: [] as Array<string>,
				},
				series: [{
					name: 'Beiträge',
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
					data: [
						{
							name: 'Scope 1',
							children: [
							]
						},
						{
							name: 'Scope 2',
							children: [
							]
						},
						{
							name: 'Scope 3',
							children: []
						}
					],
					radius: [60, '80%'],
				}]
			} as any,
			pieOption: {
				title: {
					text: 'Beiträge',
					left: 'center',
				},
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)',
				},
				legend: {
					orient: 'vertical',
					left: 'left',
					data: [] as Array<string>,
				},
				series: [
					{
						name: 'Beiträge',
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
						data: [] as Array<{ name: string, value: number }>,
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)',
							},
						},
					},
				],
			} as any,
			sankeyOption: {
				series: {
					type: 'sankey',
					layout: 'none',
					nodeAlign: 'right',
					label: {
						normal: {
							formatter: '{b}'  // {b} is the node name
						}
					},
					emphasis: {
						focus: 'adjacency'
					},
					data: [
						{
							name: 'a',
						},
						{
							name: 'b',
						}
					],
					links: [
						{
							source: 'a',
							target: 'b',
							value: 1
						}
					]
				}
			} as any
		}
	},
	actions: {
		roundToTwo(num: number) {
			return +(Math.round(Number(String(num) + 'e+2')) + 'e-2');
		},
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
		removeDuplicates(data: Array<any>) {
			const returnArray = data.filter((value, index, self) =>
				index === self.findIndex((t) => (t.name === value.name))
			);
			return returnArray;

		},
		updateIndicator() {
			const placeData = getNetInstance().findPlace(usePlacesStore().place.id)
			if (placeData) {
				const content = <{
					ghgFactor: number, amount: number, pds: number,
					type: string, footprintContributions: Array<{ name: string, value: number }>, names: Array<string>,
					sankeyNodes: Array<any>, sankeyLinks: Array<any>
				}>placeData.marking[0];

				if (this.indicatorType === 'pcf-pie') {
					//@ts-ignore
					if (content && content.footprintContributions) {
						this.indicatorValue = this.roundToTwo(content.ghgFactor * content.amount) + " kg CO2e";
						this.pieOption.series[0].data = this.processContributions(content.footprintContributions);
					} else {
						this.pieOption.series[0].data = [];
						this.indicatorValue = "<keine Daten>";

					}
					//@ts-ignore
					//TODO: generate names from footprintContributions (if necessary)
				} else if (this.indicatorType === 'pcf-sunburst') {
					//@ts-ignore
					if (content && content.footprintContributions) {
						this.indicatorValue = this.roundToTwo(content.ghgFactor * content.amount) + " kg CO2e";
						//@ts-ignore
						this.sunburstOption.series[0].data[0].children = this.processContributions(content.footprintContributions[1]);
						//@ts-ignore
						this.sunburstOption.series[0].data[1].children = this.processContributions(content.footprintContributions[2]);
						//@ts-ignore
						this.sunburstOption.series[0].data[2].children = this.processContributions(content.footprintContributions[3]);
					} else {
						this.pieOption.series[0].data = [];
						this.indicatorValue = "<keine Daten>";

					}


				} else if (this.indicatorType === 'pcf-sankey') {
					//@ts-ignore
					if (content && content.footprintContributions) {
						this.indicatorValue = this.roundToTwo(content.ghgFactor * content.amount) + " kg CO2e";
						this.sankeyOption.series.data = this.removeDuplicates(content.sankeyNodes);
						this.sankeyOption.series.links = content.sankeyLinks;
					} else {
						this.sankeyOption.series.data = [];
						this.sankeyOption.series.links = [];
						this.indicatorValue = "<keine Daten>";

					}
				} else if (this.indicatorType === 'pds') {
					if (content) {
						this.indicatorValue = Math.round(content.pds * 100) + "% Primärdaten";
					} else {
						this.indicatorValue = "<keine Daten>";
					}
				}
			}
		}
	}
})