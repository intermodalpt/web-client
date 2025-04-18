/*
    Intermodal, transportation information aggregator
    Copyright (C) 2022 - 2025 Cláudio Pereira

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

export const apiServer = 'https://api.intermodal.pt';
export const tileStyle = 'https://tiles2.intermodal.pt/styles/iml/style.json';

const minute = 1000 * 60;
export const cacheRefreshTime = minute * 60 * 2; // 2 hours
export const cacheInvalidationTime = minute * 60 * 12; // 12 hours

export const operatorsWithIcons = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
export const operatorsWithMinIcons = new Set([1, 3, 4, 5, 6, 7]);
export const operatorsWithIllustrations = new Set([1, 2, 3, 4, 5, 6, 9]);

export const secondaryOperators = new Set([91, 90, 89]);
