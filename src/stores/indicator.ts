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
import type { ComposeOption } from 'echarts/core'
import type { PieSeriesOption } from 'echarts/charts'
import type {
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption
} from 'echarts/components'

use([TitleComponent, TooltipComponent, LegendComponent, PieChart, SVGRenderer])

export const useIndicatorStore = defineStore('indicator', {
    state: () => {
        return {
            selectedPlaceID: 'none' as string,
            placeName: '' as string,
            indicatorValue: "... loading" as string,
            indicatorType: 'pcf' as string,
            // contributions: [] as Array<{ name: string, value: number }>,
            // legend: [] as Array<string>,
            option: {
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
            } as any
        }
    },
    actions: {
        reset() {
            this.selectedPlaceID = 'none'
        },
        selectPlace(id: string) {
            this.selectedPlaceID = id;

            this.updateIndicator();
        },
        roundToTwo(num: number) {
            return +(Math.round(Number(String(num) + 'e+2')) + 'e-2');
        },
        processContributions(arrayOfContribs: Array<{ name: string, value: number }>): Array<{ name: string, value: number}> {
            const returnArray = [] as Array<{ name: string, value: number }>;
            // const existingNames = [] as Array<string>;

            for (let i = 0; i < arrayOfContribs.length; i++) {
                const contrib = arrayOfContribs[i];
                if (!returnArray.find((el) => el.name == contrib.name)) {
                    // if name doesn't exist, create new entry in return Array
                    // existingNames.push(contrib.name);
                    returnArray.push(contrib);
                } else {
                    //else add up values
                    const entry = returnArray.find((el) => el.name == contrib.name)!; 
                    entry.value += contrib.value
                }
            }
            return returnArray;
        },
        updateIndicator() {
            const placeData = getNetInstance().findPlace(this.selectedPlaceID)
            if (placeData) {
                this.placeName = placeData.name;
                console.log(placeData);
                const content = <{ ghgFactor: number, amount: number, pds: number, type: string, footprintContributions: Array<{ name: string, value: number }>, names: Array<string> }>placeData.marking[0];

                if (this.indicatorType === 'pcf') {
                    //@ts-ignore
                    if (content && content.footprintContributions) {
                        this.indicatorValue = this.roundToTwo(content.ghgFactor * content.amount) + " kgCO2eq";
                        this.option.series[0].data = this.processContributions(content.footprintContributions);
                    } else {
                        // this.option.series[0].data = [{ name: this.placeName, value: content.ghgFactor * content.amount }];
                        this.option.series[0].data = [];
                        this.indicatorValue = "... loading";
                        
                    } 
                    //@ts-ignore
                    //TODO: generate names from footprintContributions (if necessary)
                    // this.option.legend.data = content.names;
                } else if (this.indicatorType === 'pds') {
                    // if (content.typej === "Sekundaerdaten") {
                        // this.indicatorValue = "0% Primärdaten"
                    // } else {
                        if (content) {

                            this.indicatorValue = Math.round(content.pds * 100) + "% Primärdaten";
                        } else {
                            this.indicatorValue = "...loading";
                        }
                        // this.option.series[0].data = content.pdsContributions;
                        // this.option.series[0].data.push({ name: "Secondary Data", value: 1-content.pds })
                        // this.option.legend.data = content.names;
                    // }
                }
            }

        }

    }
})