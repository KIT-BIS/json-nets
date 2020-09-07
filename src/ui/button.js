import {html} from 'lit-html';

export const button = (icon, callback) => html`
<button @click=${(event) => {
    callback();
    event.stopPropagation();
  }} class="button is-white">
<span class="icon is-small">
<i class="fas fa-${icon}"></i>
</span>
</button>
`;
