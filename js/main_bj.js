import {oConfig, RAFFLE_STATE} from './modules/config.js';
import oCommon from "./modules/common.js";

const oMain = (() => {
    'use strict';

    const RaffleListArray = [];
    const selectorMap = {
        mainDiv: '#main-div',
        raffleAddDiv: '#raffle-add-div',
        raffleDetailInfoDiv: '#raffle-detail-info-div',
        raffleListTbody: '#raffle-list-tbody',
        raffleAddShowBtn: '#raffle-add-show-btn',
        raffleAddColumnInputDiv: '.add-column-input-div',
        raffleAddColumnDiv: '#raffle-add-column-div',
        raffleAddSubjectInput: '#raffle-add-div [name="add-raffle-name"]',
        raffleAddColumnInput: '#raffle-add-div [name="add-raffle-column[]"]',
        raffleAddBtn: '#raffle-add-btn',
        raffleDetailInfoThead: '#raffle-detail-info-thead',
        raffleDetailInfoTbody: '#raffle-detail-info-tbody',
    };

    const template = (() => {
        return {
            emptyRaffleList: () => {
                return `<tr><td colspan="5" class="text-center">추첨 리스트가 없습니다.</td></tr>`;
            },
            raffleList: () => {
                return RaffleListArray.map((row, index) => {
                    const raffleNo = index + 1;
                    return `<tr>
                                <td class="text-center">${raffleNo}</td>
                                <td>${row.raffleName}</td>
                                <td class="text-center">${row.headCount.toLocaleString('ko')}</td>
                                <td class="text-center">
                                    ${row.status === RAFFLE_STATE.ING ? `<input class="form-check-input large-checkbox raffle-finishing-btn" type="checkbox" value="" data-raffle-no="${raffleNo}" checked>` :
                                        row.status === RAFFLE_STATE.DEAD_LINE_COMPLETED || row.status === RAFFLE_STATE.FINISH ? template.finishingText() : ''}
                                </td>
                                <td class="text-center">
                                    ${row.status === RAFFLE_STATE.ING || row.status === RAFFLE_STATE.DEAD_LINE_COMPLETED ? `<button class="btn btn-primary btn-sm raffle-detail-view-btn" data-raffle-no="${raffleNo}">상세보기</button>` :
                                        row.status === RAFFLE_STATE.FINISH ? `<button class="btn btn-primary btn-sm raffle-detail-view-btn" data-raffle-no="${raffleNo}">추첨 완료</button>` : ''}
                                </td>
                            </tr>`;
                }).join('');
            },
            columnInputDiv: () => {
                return `<div class="input-group mb-3 add-column-input-div">
                            <button class="btn btn-outline-secondary column-minus-btn" type="button">-</button>
                            <button class="btn btn-outline-secondary column-add-btn" type="button">+</button>
                            <input type="text" class="form-control" placeholder="항목을 입력해주세요." name="add-raffle-column[]">
                        </div>`;
            },
            finishingText: () => {
                return `<span>마감</span>`;
            },
        };
    })();

    const render = (() => {
        return {
            raffleList: () => {
                document.querySelector(selectorMap.raffleAddDiv).style.display = 'none';
                document.querySelector(selectorMap.mainDiv).style.display = '';
                if (RaffleListArray.length === 0) {
                    document.querySelector(selectorMap.raffleListTbody).innerHTML = template.emptyRaffleList();
                    return;
                }

                document.querySelector(selectorMap.raffleListTbody).innerHTML = template.raffleList();
            },
            raffleAddShowProc: () => {
                document.querySelector(selectorMap.raffleAddDiv).style.display = '';
                document.querySelector(selectorMap.mainDiv).style.display = 'none';
                document.querySelector(selectorMap.raffleAddSubjectInput).value = '';
                document.querySelector(selectorMap.raffleAddColumnDiv).innerHTML = `${template.columnInputDiv()}${template.columnInputDiv()}${template.columnInputDiv()}`;
            },
            raffleDetailViewShowProc: (raffleNo) => {
                if (!RaffleListArray[raffleNo-1]) {
                    alert('해당 추첨 정보가 없습니다.');
                    this.raffleList();
                    return;
                }
                document.querySelector(selectorMap.raffleDetailInfoDiv).style.display = '';
                document.querySelector(selectorMap.mainDiv).style.display = 'none';
                document.querySelector(`${selectorMap.raffleDetailInfoDiv} .custom-title`).innerHTML = `${RaffleListArray[raffleNo-1].raffleName}`;
            },
        };
    })();

    const event = (() => {
        return {
            init: () => {
                // 추첨 추가하기 버튼 클릭 이벤트
                document.querySelector(selectorMap.raffleAddShowBtn).addEventListener('click', () => {
                    render.raffleAddShowProc();
                });

                // 추첨 추가하기 완료 버튼 클릭 이벤트
                document.querySelector(selectorMap.raffleAddBtn).addEventListener('click', () => {
                    const raffleName = document.querySelector(selectorMap.raffleAddSubjectInput).value.trim();
                    const raffleColumnList = [...document.querySelectorAll(selectorMap.raffleAddColumnInput)].map((input) => input.value.trim());
                    let validate = true;

                    if (raffleName === '') {
                        alert('추첨명을 입력해주세요.');
                        document.querySelector(selectorMap.raffleAddSubjectInput).focus();
                        return;
                    }

                    raffleColumnList.forEach((value, index) => {
                        if (value === '' && validate) {
                            validate = false;
                            alert('추첨 열명을 입력해주세요.');
                            document.querySelectorAll(selectorMap.raffleAddColumnInput)[index].focus();
                        }
                    });

                    if (!validate) return;

                    RaffleListArray.push({
                        raffleName: raffleName,
                        raffleColumnList: raffleColumnList,
                        headCount: 0,
                        status: RAFFLE_STATE.ING,
                    });

                    render.raffleList();

                    //TODO 추첨 추가하기 채팅 서버 전송 처리
                });

                // close button event
                oCommon.addDelegateTarget(document, 'click', 'button.close', (event) => {
                    event.target.closest('.top-container').style.display = 'none';
                    document.querySelector(selectorMap.mainDiv).style.display = '';
                });

                // 추첨 신청 열 제거
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.raffleAddColumnInputDiv} .column-minus-btn`, (event) => {
                    if (document.querySelectorAll(selectorMap.raffleAddColumnInputDiv).length === 1) {
                        alert('최소 1개 이상의 항목은 필요합니다.');
                        return;
                    }
                    event.target.closest(selectorMap.raffleAddColumnInputDiv).remove();
                });

                // 추첨 신청 열 추가
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.raffleAddColumnInputDiv} .column-add-btn`, (event) => {
                    event.target.closest(selectorMap.raffleAddColumnInputDiv).insertAdjacentHTML('afterend', template.columnInputDiv());
                });

                // 추첨 마감 처리 이벤트
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.raffleListTbody} .raffle-finishing-btn`, (event) => {
                    const {raffleNo} = event.target.dataset;

                    RaffleListArray[raffleNo-1].status = RAFFLE_STATE.DEAD_LINE_COMPLETED;

                    event.target.closest('td').innerHTML = template.finishingText();

                    //TODO 추첨 마감 처리 채팅 서버 전송 처리
                });

                // 추첨 상세보기 / 추첨 완료 버튼 이벤트
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.raffleListTbody} .raffle-detail-view-btn`, (event) => {
                    const {raffleNo} = event.target.dataset;
                    render.raffleDetailViewShowProc(raffleNo);
                });
            },
        };
    })();

    return {
        init: () => {
            //TODO 초기데이터 테스트 셋팅
            RaffleListArray.push({
                raffleName: '테스트1',
                raffleColumnList: ['티어', '디스코드', '롤아이디'],
                headCount: 1392,
                status: RAFFLE_STATE.ING,
            });
            RaffleListArray.push({
                raffleName: '테스트2',
                raffleColumnList: ['티어', '디스코드', '롤아이디'],
                headCount: 10,
                status: RAFFLE_STATE.DEAD_LINE_COMPLETED,
            });
            RaffleListArray.push({
                raffleName: '테스트3',
                raffleColumnList: ['티어', '디스코드', '롤아이디'],
                headCount: 4214,
                status: RAFFLE_STATE.FINISH,
            });
            render.raffleList();
            event.init();
        },
    };
})();

(() => {
    oConfig.init();
    oMain.init();
})();
