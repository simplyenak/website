import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TestButton } from './TestButton';

const meta = {
  title: 'Components/TestButton',
  component: TestButton,
  tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof TestButton>;

export default meta;
type Story = StoryObj<typeof TestButton>;

// Default story
export const Primary: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

// CSS Check - verifying that our component applies the correct styles
export const CssCheck: Story = {
  args: {
    children: 'Submit',
    variant: 'primary',
    size: 'medium',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /submit/i });
    // Check that the button has the expected background color (blue-600)
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(37, 99, 235)');
    
    // Also check padding for medium size
    const computedStyle = getComputedStyle(button);
    expect(computedStyle.paddingTop).toBe('0.75rem'); // py-3 = 0.75rem top and bottom
    expect(computedStyle.paddingLeft).toBe('1rem');   // px-4 = 1rem left and right
  },
};