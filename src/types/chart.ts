export interface ChartConfig {
  title: string
  xAxis: string
  yAxis: string
}

export interface ChartData {
  [key: string]: number | string
}

export interface ChartProps {
  config: ChartConfig
  data: ChartData[]
}            

