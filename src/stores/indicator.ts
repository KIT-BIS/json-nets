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
        updateIndicator() {
            const placeData = getNetInstance().findPlace(this.selectedPlaceID)
            if (placeData) {
                this.placeName = placeData.name;
                const content = <{ ghgFactor: number, amount: number, pds: number, type: string, pdsContributions: Array<{ name: string, value: number }>, footprintContributions: Array<{ name: string, value: number }>, names: Array<string> }>placeData.marking[0].data;

                if (this.indicatorType === 'pcf') {
                    this.indicatorValue = this.roundToTwo(content.ghgFactor * content.amount) + " kgCO2eq";
                    //@ts-ignore
                    this.option.series[0].data = content.footprintContributions;
                    //@ts-ignore
                    this.option.legend.data = content.names;
                } else if (this.indicatorType === 'pds') {
                    // if (content.typej === "Sekundaerdaten") {
                        // this.indicatorValue = "0% Primärdaten"
                    // } else {
                        this.indicatorValue = Math.round(content.pds * 100) + "% Primärdaten";
                        // this.option.series[0].data = content.pdsContributions;
                        // this.option.series[0].data.push({ name: "Secondary Data", value: 1-content.pds })
                        // this.option.legend.data = content.names;
                    // }
                }
            }

        }

    }
})