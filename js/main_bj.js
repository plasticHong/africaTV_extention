import oConfig from './modules/config.js';

const oMain = (() => {
    'use strict';

    const RaffleListObj = {};
    const selectorMap = {
        mainDiv: '#main-div',
        raffleAddDiv: '#raffle-add-div',
        raffleListTbody: '#raffle-list-tbody',
        raffleAddShowBtn: '#raffle-add-show-btn',
        raffleAddColumnInputDiv: '.add-column-input-div',
        raffleAddColumnDiv: '#raffle-add-column-div',
        raffleAddSubjectInput: '#raffle-add-div [name="add-raffle-name"]',
        raffleAddColumnInput: '#raffle-add-div [name="add-raffle-column[]"]',
        raffleAddBtn: '#raffle-add-btn',
    };

    const template = (() => {
        return {
            emptyRaffleList: () => {
                return `<tr><td colspan="4" class="text-center">추첨 리스트가 없습니다.</td></tr>`;
            },
            columnInputDiv: () => {
                return `<div class="input-group mb-3 add-column-input-div">
                            <button class="btn btn-outline-secondary column-minus-btn" type="button">-</button>
                            <button class="btn btn-outline-secondary column-add-btn" type="button">+</button>
                            <input type="text" class="form-control" placeholder="명칭을 입력해주세요." name="add-raffle-column[]">
                        </div>`;
            },
        };
    })();

    const render = (() => {
        return {
            raffleList: () => {
                if (Object.keys(RaffleListObj).length === 0) {
                    document.querySelector(selectorMap.raffleListTbody).innerHTML = template.emptyRaffleList();
                    return;
                }
            },
        };
    })();

    const event = (() => {
        return {
            init: () => {
                // 추첨 추가하기 버튼 클릭 이벤트
                document.querySelector(selectorMap.raffleAddShowBtn).addEventListener('click', () => {
                    document.querySelector(selectorMap.raffleAddDiv).style.display = '';
                    document.querySelector(selectorMap.mainDiv).style.display = 'none';
                    document.querySelector(selectorMap.raffleAddColumnDiv).innerHTML = `${template.columnInputDiv()}${template.columnInputDiv()}${template.columnInputDiv()}`;
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
                        if (value === '' && !validate) {
                            validate = false;
                            alert('추첨 열명을 입력해주세요.');
                            document.querySelectorAll(selectorMap.raffleAddColumnInput)[index].focus();
                        }
                    });
                    if (!validate) return;
                });

                // close button event
                oConfig.addDelegateTarget(document, 'click', 'button.close', (event) => {
                    event.target.closest('.top-container').style.display = 'none';
                    document.querySelector(selectorMap.mainDiv).style.display = '';
                });

                // 추첨 신청 열 제거
                oConfig.addDelegateTarget(document, 'click', `${selectorMap.raffleAddColumnInputDiv} .column-minus-btn`, (event) => {
                    if (document.querySelectorAll(selectorMap.raffleAddColumnInputDiv).length === 1) {
                        alert('최소 1개 이상의 열은 필요합니다.');
                        return;
                    }
                    event.target.closest(selectorMap.raffleAddColumnInputDiv).remove();
                });

                // 추첨 신청 열 추가
                oConfig.addDelegateTarget(document, 'click', `${selectorMap.raffleAddColumnInputDiv} .column-add-btn`, (event) => {
                    event.target.closest(selectorMap.raffleAddColumnInputDiv).insertAdjacentHTML('afterend', template.columnInputDiv());
                });
            },
        };
    })();

    return {
        init: () => {
            render.raffleList();
            event.init();
        },
    };
})();

(() => {
    oConfig.init();
    oMain.init();
})();
