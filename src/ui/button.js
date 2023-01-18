import {html} from 'lit-html';

export const button = (icon, isActive, callback) => html`
<button @click=${(event) => {
    callback();
    event.stopPropagation();
  }} class="button is-primary ${isActive}">
<span class="icon is-small">
<i class="fas fa-${icon}"></i>
</span>
</button>
`;
