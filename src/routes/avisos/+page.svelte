<!-- Intermodal, transportation information aggregator
    Copyright (C) 2022  Cláudio Pereira

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>. -->
<div class="flex flex-col gap-2">
	<div class="card bg-base-100 shadow-xl mx-2">
		<div class="card-body">
			<h2 class="card-title">⚠️⚠️⚠️ Conteúdo ilustrativo⚠️⚠️⚠️</h2>
			<p>Esta página é uma prova de conceito. Os dados são falsos.</p>
			<p>Temos alguns verdadeiros na <a class="link link-primary" href="/estado">errata</a>.</p>
		</div>
	</div>

	<div class="card card-sm bg-base-100 shadow-xl mx-2">
		<div class="collapse collapse-arrow rounded-box">
			<input type="checkbox" class="cursor-pointer" />
			<div class="collapse-title text-xl font-medium flex flex-row justify-between">
				Carris Metropolitana
				<div>
					<span class="badge badge-error">1</span>
					<span class="badge badge-info">1</span>
				</div>
			</div>
			<div class="collapse-content p-0!">
				<div class="p-1 text-sm flex flex-col gap-2">
					<div class="flex flex-col border-info border-2 p-2 rounded-xl">
						<div class="flex flex-row font-bold items-center text-info-content">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								class="stroke-current shrink-0 w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Alteração temporária de horários
						</div>
						<div>
							Durante o mês de Junho a operação da zona 4 decorre com os horários prévios à Carris
							Metropolitana.
						</div>
					</div>

					<div class="flex flex-col border-error border-2 p-2 rounded-xl">
						<div class="flex flex-row font-bold items-center text-error-content">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="stroke-current shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Supressão de linhas
						</div>
						<div>A linha 5432 poderá estar a funcionar, bem como poderá não estar.</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="card card-sm bg-base-100 shadow-xl mx-2">
		<div class="collapse collapse-arrow rounded-box">
			<input type="checkbox" class="cursor-pointer" />
			<div class="collapse-title text-xl font-medium flex flex-row justify-between">
				Transtejo/Softlusa
				<div>
					<div class="badge badge-warning">1</div>
				</div>
			</div>
			<div class="collapse-content p-0!">
				<div class="p-1 text-sm flex flex-col gap-2">
					<div class="flex flex-col border-warning border-2 p-2 rounded-xl">
						<div class="flex flex-row font-bold items-center text-warning-content">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="stroke-current shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							Barreiro - Terreiro do Paço
						</div>
						<div>Perturbações de serviço entre 30 de Maio e 30 de Junho</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
