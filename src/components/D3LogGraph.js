// src/components/D3LogGraph.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getD3Data } from '../console-monkey-patch';

const WIDTH = 400;
const HEIGHT = 160;
const MARGIN = { top: 10, right: 10, bottom: 20, left: 30 };

function valueToNumber(v, index) {
    if (typeof v === 'number') return v;

    if (typeof v === 'string') {
        const m = v.match(/-?\d+(\.\d+)?/);
        if (m) return parseFloat(m[0]);
        return index;
    }

    if (Array.isArray(v) && v.length > 0) {
        return valueToNumber(v[0], index);
    }

    if (typeof v === 'object' && v !== null) {
        if (typeof v.value === 'number') return v.value;
        const firstNum = Object.values(v).find((x) => typeof x === 'number');
        if (typeof firstNum === 'number') return firstNum;
        return index;
    }

    return index;
}

export default function D3LogGraph() {
    const svgRef = useRef(null);
    const [values, setValues] = useState([]);

    useEffect(() => {
        const id = setInterval(() => {
            try {
                const raw = getD3Data() || [];

                const nums = raw.map((v, i) => valueToNumber(v, i));
                setValues(nums);
            } catch (e) {
                console.error('Error reading D3 data:', e);
            }
        }, 250);

        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        svg.selectAll('*').remove();

        const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
        const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

        const g = svg
            .append('g')
            .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

        const xMax = Math.max(values.length - 1, 10);
        const xScale = d3
            .scaleLinear()
            .domain([0, xMax])
            .range([0, plotWidth]);

        let minY = 0;
        let maxY = 1;

        if (values.length > 0) {
            const ext = d3.extent(values);
            minY = ext[0];
            maxY = ext[1];
            if (minY === maxY) {
                minY -= 0.5;
                maxY += 0.5;
            }
        }

        const yScale = d3
            .scaleLinear()
            .domain([minY, maxY])
            .range([plotHeight, 0]);

        const data = values.map((y, i) => ({ x: i, y }));

        const line = d3
            .line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y));

        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'currentColor')
            .attr('stroke-width', 1.5)
            .attr('d', line);

        const xAxis = d3.axisBottom(xScale).ticks(5);
        const yAxis = d3.axisLeft(yScale).ticks(4);

        g.append('g')
            .attr('transform', `translate(0, ${plotHeight})`)
            .call(xAxis);

        g.append('g').call(yAxis);
    }, [values]);

    return (
        <div>
            <svg ref={svgRef} style={{ width: '100%', height: '160px' }} />
            <small className="text-muted">
                Live data from Strudel <code>.log()</code> (last 100 values)
            </small>
        </div>
    );
}