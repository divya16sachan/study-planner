import React, { useState } from 'react';
import "katex/dist/katex.min.css";
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Sigma } from 'lucide-react';
import { Button } from '../ui/button';
import TooltipWrapper from '../TooltipWrapper';
import katex from 'katex';
export const MathsSymbol = ({ editor }) => {
  const symbols = [
    { latex: "x_y", description: "Subscript", },
    { latex: "x^y", description: "Superscript", },
    { latex: "\\bar{x}", description: "bar", },
    { latex: "\\frac{x}{y}", description: "Fraction", },
    { latex: "\\sqrt{x}", description: "Square Root", },
    { latex: "\\sqrt[n]{x}", description: "nth Root", },
    { latex: "\\int_{x}^{y}", description: "Integral", },
    { latex: "\\Sigma", description: "Sigma", },
    { latex: "\\vec{x}", description: "Vector", },
    { latex: "\\dot{x}", description: "Dot above", },
    { latex: "\\times", description: "Multiplication", },
    { latex: "\\div", description: "Division", },
    { latex: "\\neq", description: "Not equals", },
    { latex: "\\approx", description: "Approximately equal to", },
    { latex: "\\leq", description: "Less than or equal to" },
    { latex: "\\geq", description: "Greater than or equal to" },
    { latex: "\\infty", description: "Infinity", },
    { latex: "\\alpha", description: "Alpha", },
    { latex: "\\beta", description: "Beta", },
    { latex: "\\gamma", description: "Gamma", },
    { latex: "\\delta", description: "Delta", },
    { latex: "\\theta", description: "Theta", },
    { latex: "\\lambda", description: "Lambda", },
    { latex: "\\mu", description: "Mu", },
    { latex: "\\pi", description: "Pi", },
    { latex: "\\phi", description: "Phi", },
    { latex: "\\omega", description: "Omega", },
    { latex: "\\Delta", description: "Delta", },
    { latex: "\\pi", description: "PI", },
    { latex: "\\Omega", description: "Omega", },
  ];

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon"><Sigma /></Button>
      </PopoverTrigger>
      <PopoverContent className="p-1">
        {
          symbols.map(({ description, latex }) => (
            <TooltipWrapper message={description}>
              <Button size="icon" variant="ghost">
                <span dangerouslySetInnerHTML={{ __html: katex.renderToString(latex) }} />
              </Button>
            </TooltipWrapper>
          ))
        }
      </PopoverContent>
    </Popover>
  );
};
