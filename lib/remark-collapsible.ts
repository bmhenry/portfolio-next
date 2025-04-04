import { visit } from 'unist-util-visit';
import { Node } from 'unist';
import { VFile } from 'vfile';

// Extend the Node interface to include children
interface NodeWithChildren extends Node {
  children?: Array<Node>;
}

interface CollapsibleNode extends NodeWithChildren {
  type: 'collapsible';
  title: string;
  open: boolean;
  children: NodeWithChildren[];
  data?: {
    hName?: string;
  };
}

interface TextNode extends Node {
  type: 'text';
  value: string;
}

interface HtmlNode extends Node {
  type: 'html';
  value: string;
}

interface ParagraphNode extends NodeWithChildren {
  type: 'paragraph';
}

// Regular expression to match the collapsible syntax
// :::collapsible[Title]{open} (optional open parameter)
// Content
// :::
const COLLAPSIBLE_REGEX = /^:::collapsible\[(.*?)\](?:\{(.*?)\})?\s*$/;
const COLLAPSIBLE_END_REGEX = /^:::\s*$/;

function remarkCollapsible() {
  return (tree: NodeWithChildren, file: VFile) => {
    // Simple approach: directly convert the syntax to HTML
    visit(tree, 'text', (node: TextNode) => {
      // Check if the text contains our collapsible syntax
      if (node.value.includes(':::collapsible[')) {
        // Replace the collapsible syntax with HTML
        let newValue = node.value;
        
        // Replace opening tags
        newValue = newValue.replace(
          /:::collapsible\[(.*?)\](?:\{(.*?)\})?\s*/g, 
          (match, title, options) => {
            const isOpen = options && options.includes('open');
            const openAttr = isOpen ? ' data-collapsible-open' : '';
            return `<div data-collapsible${openAttr}><div data-collapsible-title>${title}</div><div data-collapsible-content>`;
          }
        );
        
        // Replace closing tags
        newValue = newValue.replace(/:::\s*/g, '</div></div>');
        
        // Update the node value
        node.value = newValue;
      }
    });
  };
}

export default remarkCollapsible;
