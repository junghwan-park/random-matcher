import { Group } from '@/js/core/state';

export default class GroupItem {
  el: HTMLDivElement | null = null;

  imageEl: HTMLImageElement | null = null;

  nameEl: HTMLDivElement | null = null;

  group: Group;

  constructor(group: Group) {
    this.group = group;
  }

  render(): HTMLDivElement {
    this.el = document.createElement('div');
    this.el.className = 'group-item';

    this.imageEl = document.createElement('img');
    this.imageEl.className = 'group-image';
    this.imageEl.src = this.group.imgSrc;
    this.el.appendChild(this.imageEl);

    this.nameEl = document.createElement('div');
    this.nameEl.className = 'group-name';
    this.nameEl.textContent = this.group.name;
    this.el.appendChild(this.nameEl);

    return this.el;
  }
}
