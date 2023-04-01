# React Calendar Graph

A calendar graph react-component inspired by github's contribution graph. [**Try it out on CodeSandbox**](https://codesandbox.io/p/sandbox/charming-meninsky-fhonf3).

![md-1](https://llx.cool/public/calendar-graph/md-1.png)

[See vue version](https://www.npmjs.com/package/vue-calendar-graph)

## Setup

Install the npm module with yarn or pnpm:

```bash
pnpm add react-calendar-graph
```

## Usage

Import the component:

```ts
import CalendarGraph from "react-calendar-graph"
```

Import styles. You can directly import from the module, which requires a CSS loader:

```ts
import "react-calendar-graph/dist/style.css"
```

## Props
```ts
type TypeProps = {
  year   : number
  isDark?: boolean
  colors?: { [key in (0 | 1 | 2 | 3 | 4)]: string }
  levels?: { [key in (1 | 2 | 3 | 4)]: number }

 /** Sort by days, need consecutive */
  records?: number[]

  /** The function runs when you click the `<rd/>` element */
  recordHandle?: (record: TypeRecord) => (any)

  /** When you hove `<rd/>` element, the result of running the function is displayed */
  renderTootip?: (record: TypeRecord) => string
}

type TypeRecord = {
  /** The nth day of the year */
  days : number
  /** Count of the day */
  count: number
}

```

## MIT License
Copyright &copy; 2023 [Longxiang Li](https://llx.cool)

[See more LICENSE](https://github.com/llx-00/react-calendar-graph/blob/main/LICENSE)
