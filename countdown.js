// 配置常量 
const WORK_DURATION = 7.75 * 60 * 60 * 1000; // 7小时45分钟工作(465分钟)
const NOON_REST_DURATION = 45 * 60 * 1000; // 45分钟午休 
const NIGHT_REST_DURATION = 15 * 60 * 1000; // 15分钟晚休 
const MAX_WORK_WITHOUT_REST = 8 * 60 * 60 * 1000; // 8小时 
 
// 语言资源 
const translations = {
  zh: {
    title: "下班倒计时 测试版",
    infoInitializing: "正在初始化...",
    statusDefault: "--",
    workLegend: "工作时间",
    noonRestLegend: "午休时间",
    nightRestLegend: "晚休时间",
    overtimeLegend: "加班时间",
    resetBtn: "重新设置上班时间",
    stopBtn: "下班啦!!",
    languageBtn: "English/日本語",
    footer: "© 2025 Liu Yuqing",
    working: "💼 工作中",
    noonRest: "🍱 午休中（计时暂停）",
    nightRest: "🍜 晚休中（计时暂停）",
    overtime: "☕ 加班中",
    timeFormat: "上班 : {0}  → 下班 : {5}<br>午休 : {1} ~ {2}<br>晚休 : {3} ~ {4}",
    prompt: "请输入上班时间\nPlease enter your work start time \n仕事の開始時間を入力してください \n(e.g. 0900 = 9:00 am)",
    errorFormat: "格式错误：需输入4位数字\nFormat error: Need 4 digits\n形式エラー：4桁の数字が必要",
    errorInvalid: "时间不合法，请重新输入！\nInvalid time, try again!\n無効な時間、再入力してください",
    resetConfirm: "已重置",
    startLabel: "上班",
    endLabel: "下班",
    overtimePayLabel: "加班费",
    payCurrency: "日元/小时",
    overtimePayFormat: "{0} 小时 × {1} {2} = {3} {4}" 
  },
  en: {
    title: "Work End Countdown for Test",
    infoInitializing: "Initializing...",
    statusDefault: "--",
    workLegend: "Working Time",
    noonRestLegend: "Noon Break",
    nightRestLegend: "Night Break",
    overtimeLegend: "Overtime",
    resetBtn: "Reset Start Time",
    stopBtn: "Off Work!!",
    languageBtn: "中文/日本語",
    footer: "© 2025 Liu Yuqing",
    working: "💼 Working",
    noonRest: "🍱 Noon Break (Timer Paused)",
    nightRest: "🍜 Night Break (Timer Paused)",
    overtime: "☕ Overtime",
    timeFormat: "Start Time : {0}  → Expected End Time : {5}<br>Noon Break : {1} ~ {2}<br>Night Break : {3} ~ {4}",
    prompt: "Enter start time (4 digits, e.g. 0900 for 9AM)",
    errorFormat: "Format error: Need 4 digits (e.g. 0830, 0900)",
    errorInvalid: "Invalid time, please try again!",
    resetConfirm: "Reset",
    startLabel: "Start",
    endLabel: "End",
    overtimePayLabel: "Overtime Pay",
    payCurrency: "JPY/hour",
    overtimePayFormat: "{0} hours × {1} {2} = {3} {4}"
  },
  ja: {
    title: "ワークタイムモニター テスト版",
    infoInitializing: "初期化中...",
    statusDefault: "--",
    workLegend: "勤務時間",
    noonRestLegend: "昼休憩",
    nightRestLegend: "夜休憩",
    overtimeLegend: "残業時間",
    resetBtn: "開始時間を再設定",
    stopBtn: "終了!!",
    languageBtn: "中文/English",
    footer: "© 2025 Liu Yuqing",
    working: "💼 勤務中",
    noonRest: "🍱 昼休憩中（タイマー停止）",
    nightRest: "🍜 夜休憩中（タイマー停止）",
    overtime: "☕ 残業中",
    timeFormat: "開始時間 : {0}  → 終了予定 : {5}<br>昼休憩 : {1} ~ {2}<br>夜休憩 : {3} ~ {4}",
    prompt: "開始時間を入力してください（4桁数字、例: 0900で9時）",
    errorFormat: "形式エラー、4桁数字を入力してください（例: 0830, 0900）",
    errorInvalid: "無効な時間です、再入力してください！",
    resetConfirm: "リセット完了",
    startLabel: "開始",
    endLabel: "終了",
    overtimePayLabel: "残業代",
    payCurrency: "円/時間",
    overtimePayFormat: "{0} 時間 × {1} {2} = {3} {4}"
  }
};
 
// 全局变量 
let startTime = null;
let endTime = null;
let noonStart = null;
let noonEnd = null;
let nightRestStart = null;
let nightRestEnd = null;
let isOvertime = false;
let overtimeStart = null;
let updateInterval = null;
let currentLang = localStorage.getItem('workTimerLanguage')  || 'zh'; // 默认中文 
let payRate = 2500; // 默认加班费率 
let overtimePay = 0; // 加班费总额 
let isTimerStopped = false; //下班停止计时
 
// 切换语言 
function switchLanguage() {
  currentLang = currentLang === 'zh' ? 'en' : currentLang === 'en' ? 'ja' : 'zh';
  localStorage.setItem('workTimerLanguage',  currentLang); // 保存语言选择 
  applyLanguage();
  saveState();
}
 
// 应用语言 
function applyLanguage() {
  const t = translations[currentLang];
  document.getElementById('title').textContent  = t.title;  
  document.getElementById('workLegend').textContent  = t.workLegend;  
  document.getElementById('noonRestLegend').textContent  = t.noonRestLegend;  
  document.getElementById('nightRestLegend').textContent  = t.nightRestLegend;  
  document.getElementById('overtimeLegend').textContent  = t.overtimeLegend;  
  document.getElementById('resetBtn').textContent  = t.resetBtn;  
  document.getElementById('languageBtn').textContent  = t.languageBtn;  
  document.getElementById('footer').textContent  = t.footer;  
  document.getElementById('overtimePayLabel').textContent  = t.overtimePayLabel; 
  document.getElementById("stopBtn").textContent  = t.stopBtn; 
  document.getElementById('payRateDisplay').textContent  = payRate.toLocaleString()  + ' ' + t.payCurrency; 
  
  // 更新状态标签 
  const now = new Date();
  if (isOvertime) {
    if (now >= nightRestStart && now < nightRestEnd) {
      document.getElementById("statusLabel").textContent  = t.nightRest;  
    } else {
      document.getElementById("statusLabel").textContent  = t.overtime;  
    }
  } else if (now >= noonStart && now < noonEnd) {
    document.getElementById("statusLabel").textContent  = t.noonRest;  
  } else if (now < endTime) {
    document.getElementById("statusLabel").textContent  = t.working;  
  }
  
  if (startTime) {
    updateInfoDisplay();
    updateOvertimePay();
  }
}
 
// 保存状态到本地存储 
function saveState() {
  const state = {
    isTimerStopped: isTimerStopped,
    startTime: startTime ? startTime.getTime()  : null,
    endTime: endTime ? endTime.getTime()  : null,
    noonStart: noonStart ? noonStart.getTime()  : null,
    noonEnd: noonEnd ? noonEnd.getTime()  : null,
    nightRestStart: nightRestStart ? nightRestStart.getTime()  : null,
    nightRestEnd: nightRestEnd ? nightRestEnd.getTime()  : null,
    isOvertime: isOvertime,
    overtimeStart: overtimeStart ? overtimeStart.getTime()  : null,
    savedWorkStartTime: localStorage.getItem('workStartTime'), 
    payRate: payRate,
    language: currentLang 
  };
  localStorage.setItem('workTimerState',  JSON.stringify(state)); 
}



// 从本地存储恢复状态 
function restoreState() {
  const savedLang = localStorage.getItem('workTimerLanguage'); 
  const savedState = localStorage.getItem('workTimerState');  

  if (savedLang) currentLang = savedLang;

  if (savedState) {
    try {
      const state = JSON.parse(savedState);  

      // 恢复时间数据 
      if (state.startTime)  startTime = new Date(state.startTime);  
      if (state.endTime)  endTime = new Date(state.endTime);  
      if (state.noonStart)  noonStart = new Date(state.noonStart);  
      if (state.noonEnd)  noonEnd = new Date(state.noonEnd);  
      if (state.nightRestStart)  nightRestStart = new Date(state.nightRestStart);  
      if (state.nightRestEnd)  nightRestEnd = new Date(state.nightRestEnd);  

      // 恢复业务状态 
      isOvertime = state.isOvertime;  
      if (state.overtimeStart)  overtimeStart = new Date(state.overtimeStart);  


      if (state.savedWorkStartTime)  {
        localStorage.setItem('workStartTime',  state.savedWorkStartTime);  
      }
      if (state.payRate)  {
        payRate = state.payRate; 
        document.getElementById("payRateInput").value  = payRate;
      }
      if (state.language)  {
        currentLang = state.language;  
      }
      
      applyLanguage();
      return true;
    } catch (e) {
      console.error(" 恢复状态失败:", e);
      return false;
    }
  }
 return false;
}



 
// 询问上班时间 
function askStartTime() {
  const t = translations.zh;  // 中文提示作为基础 
  let savedTime = localStorage.getItem('workStartTime'); 
  let input = prompt(t.prompt,  savedTime || '0900');
  
  // 用户取消时使用默认时间 
  if (input === null) {
    input = '0900';
  }
  
  if (!input || !/^\d{4}$/.test(input)) {
    if (input !== null) alert(t.errorFormat); 
    initializeTimes(9, 0); // 使用默认时间0900 
    return false;
  }
 
  const h = parseInt(input.slice(0,  2), 10);
  const m = parseInt(input.slice(2),  10);
 
  if (h < 0 || h > 23 || m < 0 || m > 59) {
    alert(t.errorInvalid); 
    initializeTimes(9, 0); // 使用默认时间0900 
    return false;
  }
 
  localStorage.setItem('workStartTime',  input);
  initializeTimes(h, m);
  clearTimelineMarkers();
  renderTimeline();
  
  return true;
}
 
// 清除时间轴标记 
function clearTimelineMarkers() {
  document.querySelectorAll('.timeline-marker,  .current-time-indicator').forEach(el => el.remove()); 
}
 
// 初始化时间 
function initializeTimes(h, m) {

  // 设置上班时间 
  startTime = new Date();
  startTime.setHours(h,  m, 0, 0);
 
  // 设置午休时间(11:40-12:25)
  noonStart = new Date(startTime);
  noonStart.setHours(11,  40, 0, 0);
  noonEnd = new Date(noonStart.getTime()  + NOON_REST_DURATION);
 
  // 计算理论下班时间(不含晚休)
  endTime = new Date(startTime.getTime()  + WORK_DURATION);
 
  // 如果工作时间跨越午休，加上午休时间 
  if (startTime < noonEnd && endTime > noonStart) {
    endTime = new Date(endTime.getTime()  + NOON_REST_DURATION);
  }
 
  // 计算实际工作时间(扣除午休时间)
  let actualWorkTime = endTime - startTime;
  if (endTime > noonStart && startTime < noonEnd) {
    actualWorkTime -= NOON_REST_DURATION;
  }
 
  // 计算晚休时间（从上班开始累计满8小时工作时间后触发）
  nightRestStart = new Date(startTime.getTime()  + MAX_WORK_WITHOUT_REST);
  
  // 如果午休在工作时间内，需要把午休时间加回来（因为实际工作时间要扣除午休）
  if (noonStart < endTime && noonEnd > startTime) {
    nightRestStart = new Date(nightRestStart.getTime()  + NOON_REST_DURATION);
  }
  
  // 如果晚休开始时间落在午休期间，则调整到晚休之后 
  if (nightRestStart >= noonStart && nightRestStart < noonEnd) {
    nightRestStart = new Date(noonEnd.getTime());  
  }
  
  nightRestEnd = new Date(nightRestStart.getTime()  + NIGHT_REST_DURATION);
 
  // 如果实际工作时间超过8小时，添加晚休到下班时间 
  if (actualWorkTime > MAX_WORK_WITHOUT_REST) {
    endTime = new Date(endTime.getTime()  + NIGHT_REST_DURATION);
  }
 
  // 重置加班状态 
  isOvertime = false;
  overtimeStart = null;
  overtimePay = 0;
 
  // 更新信息显示 
  updateInfoDisplay();
 
  saveState();
}
 
// 更新信息显示 
function updateInfoDisplay() {
  const t = translations[currentLang];
  document.getElementById("info").innerHTML  = t.timeFormat   
    .replace('{0}', formatTime(startTime))
    .replace('{1}', formatTime(noonStart))
    .replace('{2}', formatTime(noonEnd))
    .replace('{3}', formatTime(nightRestStart))
    .replace('{4}', formatTime(nightRestEnd))
    .replace('{5}', formatTime(endTime));
}
 
// 更新进度环 
function updateProgressRing(percent) {
  const circle = document.querySelector('.progress-ring-fill'); 
  const radius = circle.r.baseVal.value; 
  const circumference = 2 * Math.PI * radius;
  
  // 超过100%保持最大状态 
  const effectivePercent = Math.min(percent,  100);
  const offset = circumference - (effectivePercent / 100) * circumference;
  
  circle.style.strokeDasharray  = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset  = offset;
  
  // 显示实际百分比（可超过100%）
  document.getElementById('progressText').textContent  = `${percent}%`;
  
  // 根据进度改变颜色 
  circle.style.stroke  = percent < 30 ? 'var(--progress-green)' : 
                       percent < 70 ? 'var(--progress-blue)' : 
                       percent < 100 ? 'var(--progress-yellow)' : 
                       'var(--progress-red)';
}



// 更新加班费显示 
function updateOvertimePay() {
  const t = translations[currentLang];
  const now = new Date();
  
  if ( (!isOvertime || !overtimeStart) && now <= nightRestStart  ) {
    document.getElementById("overtimePayDisplay").textContent  = "¥ 0";
    document.getElementById("overtimePayDetails").textContent  = "--";
    return;
  }
  
  let overtimeHours;
  let overtimeDuration;
  
  if (now >= nightRestStart && now < nightRestEnd) {
    // 晚休期间不计加班费 
    //overtimeDuration = (nightRestStart - overtimeStart);
    overtimeDuration = 15*60*1000;
  } else if (now >= nightRestEnd) {
    // 晚休后计算总加班时间减去15分钟晚休 
    overtimeDuration = (now - overtimeStart - NIGHT_REST_DURATION);
  } else {
    // 加班时间但未到晚休 
    overtimeDuration = now - overtimeStart;
  }
  
  // 确保加班时间不为负 
  overtimeHours = Math.max(0,  overtimeDuration / 1000 / 60 / 60);
  overtimePay = Math.floor(overtimeHours  * payRate);

  // 更新显示 
  document.getElementById("overtimePayDisplay").textContent  = 
    `¥ ${overtimePay.toLocaleString(currentLang  === 'ja' ? 'ja-JP' : undefined)}`;
  
  document.getElementById("overtimePayDetails").textContent  = 
    t.overtimePayFormat  
      .replace('{0}', overtimeHours.toFixed(2)) 
      .replace('{1}', payRate.toLocaleString()) 
      .replace('{2}', t.payCurrency.split('/')[0]) 
      .replace('{3}', overtimePay.toLocaleString()) 
      .replace('{4}', t.payCurrency.split('/')[0]); 
}
 


// 渲染时间轴 
function renderTimeline() {
    const timeline = document.getElementById("timeline"); 
    timeline.innerHTML  = "";
 
    const displayStart = new Date(startTime);
    displayStart.setHours(startTime.getHours()  - 1, 0, 0, 0); // 上班前1小时 
    
    const displayEnd = new Date(endTime);
    displayEnd.setHours(endTime.getHours()  + 5, 0, 0, 0); // 下班后4小时 
    
    const totalDuration = displayEnd - displayStart;
 
    // 1. 工作时间段（上午）
    addSegment(startTime, noonStart, "work", displayStart, totalDuration);
    
    // 2. 午休时间段 
    addSegment(noonStart, noonEnd, "noon-rest", displayStart, totalDuration);
    
    // 3. 工作时间段（下午）
    addSegment(noonEnd, nightRestStart, "work", displayStart, totalDuration);
    
    // 5. 加班时间段
    addSegment(endTime, displayEnd, "overtime", displayStart, totalDuration);

    // 4. 晚休时间段（最后渲染确保层级更高）
    if (nightRestStart && nightRestEnd) {
        addSegment(nightRestStart, nightRestEnd, "night-rest", displayStart, totalDuration);
    }

    // 标记和当前时间指示器 
    addMarker(startTime, translations[currentLang].startLabel, displayStart, totalDuration);
    addMarker(endTime, translations[currentLang].endLabel, displayStart, totalDuration);
    updateCurrentTimeIndicator(displayStart, displayEnd);
}
 

// 添加时间段 
function addSegment(start, end, type, dayStart, totalDuration) {
    if (!start || !end || start >= end) return;
 
    const segment = document.createElement("div"); 
    segment.className  = "timeline-segment";
 
    const left = getPercentage(start, dayStart, totalDuration);
    const width = getPercentage(end, dayStart, totalDuration) - left;
 
    segment.style.left  = `${left}%`;
    segment.style.width  = `${width}%`;
 
switch(type) {
  case "work": segment.style.backgroundColor  = "var(--work-color)"; break;
  case "noon-rest": segment.style.backgroundColor  = "var(--noon-rest-color)"; break;
  case "night-rest": segment.style.backgroundColor  = "var(--night-rest-color)"; break; // 这里会使用新的绿色 
  case "overtime": segment.style.backgroundColor  = "var(--overtime-color)"; break;
}
 
    segment.title  = `${formatTime(start)} - ${formatTime(end)} (${type})`;
    document.getElementById("timeline").appendChild(segment); 
}

 
// 添加标记 
function addMarker(time, text, dayStart, totalDuration) {
  if (!time) return;
 
  const marker = document.createElement("div"); 
  marker.className  = "timeline-marker";
  marker.style.left  = `${getPercentage(time, dayStart, totalDuration)}%`;
  marker.textContent  = `${text} ${formatTime(time)}`;
 
  document.querySelector(".timeline-container").appendChild(marker); 
}
 
// 更新当前时间指示器 
function updateCurrentTimeIndicator(displayStart, displayEnd) {
  const now = new Date();
  
  if (!displayStart || !displayEnd) {
    displayStart = new Date(startTime);
    displayStart.setHours(startTime.getHours()  - 1, 0, 0, 0);
    displayEnd = new Date(endTime);
    displayEnd.setHours(endTime.getHours()  + 5, 0, 0, 0);
  }
  
  const totalDuration = displayEnd - displayStart;
  
  document.querySelectorAll('.current-time-indicator').forEach(el  => el.remove()); 
 
  const indicator = document.createElement("div"); 
  indicator.className  = "current-time-indicator";
  indicator.style.left  = `${getPercentage(now, displayStart, totalDuration)}%`;
  
  document.getElementById("timeline").appendChild(indicator); 
}
 
// 计算百分比位置 
function getPercentage(time, dayStart, totalDuration) {
  return ((time - dayStart) / totalDuration) * 95;
}
 
// 主更新函数 
function update() {
  if (isTimerStopped) return;
  const now = new Date();
  let diff = endTime - now;
  const statusEl = document.getElementById("status"); 
  const statusLabelEl = document.getElementById("statusLabel"); 
  const t = translations[currentLang];
 
  // 检查当前状态 
  let isResting = false;
  let isNightRest = false;
 
  if (now >= noonStart && now < noonEnd) {
    statusLabelEl.textContent  = t.noonRest; 
    isResting = true;
    statusEl.className  = "status-timer noon-rest";
  } else if (now >= nightRestStart && now < nightRestEnd) {
    statusLabelEl.textContent  = t.nightRest; 
    isResting = true;
    isNightRest = true;
    statusEl.textContent  = "+00:15:00";
    statusEl.className  = "status-timer night-rest";
  } else if (now < endTime) {
    statusLabelEl.textContent  = t.working; 
    statusEl.className  = "status-timer working";
  } else {
    if (!isOvertime) {
      isOvertime = true;
      overtimeStart = new Date(endTime);
      saveState();
    }
    statusLabelEl.textContent  = t.overtime; 
    statusEl.className  = "status-timer overtime";
  }
 
  // 计算计时器显示 
  if (isOvertime && !isNightRest) {
    let overtimeDuration = now - overtimeStart;
    if (now >= nightRestEnd) overtimeDuration -= NIGHT_REST_DURATION;
    
    const h = Math.floor(overtimeDuration  / 1000 / 60 / 60);
    const m = Math.floor((overtimeDuration  / 1000 / 60) % 60);
    const s = Math.floor((overtimeDuration  / 1000) % 60);
    statusEl.textContent  = `+${pad(h)}:${pad(m)}:${pad(s)}`;
  } else if (!isResting) {
    const h = Math.floor(diff  / 1000 / 60 / 60);
    const m = Math.floor((diff  / 1000 / 60) % 60);
    const s = Math.floor((diff  / 1000) % 60);
    statusEl.textContent  = `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
 
  // 计算工作进度 (0-400%)

let progress = 0;
const baseWorkTime = 7.75 * 60 * 60 * 1000;
 
if (now >= startTime && now < noonEnd) {
  const elapsed = now - startTime;
  progress = Math.round((elapsed  / baseWorkTime) * 100);
} 
else if (now >= noonEnd && now < endTime) {
  const elapsed = now - startTime - (noonEnd - noonStart);
  progress = Math.round((elapsed  / baseWorkTime) * 100);
}
else if (now >= endTime) {
  const overtimeDuration = now - endTime - (now > nightRestStart && now < nightRestEnd ? NIGHT_REST_DURATION : 0);
  progress = 100 + Math.round((overtimeDuration  / baseWorkTime) * 100);
}
  
  updateProgressRing(progress);
  updateOvertimePay();
  updateCurrentTimeIndicator();
}
 
// 辅助函数 
function pad(n) {
  return n < 10 ? '0' + n : n;
}
 
function formatTime(date) {
  return date ? `${pad(date.getHours())}:${pad(date.getMinutes())}`  : "--:--";
}
 
// 初始化 
document.addEventListener('DOMContentLoaded',  function() {

  // 立即应用语言 
  applyLanguage();
  
  // 设置计费更新按钮 
  document.getElementById("updatePayRateBtn").addEventListener("click",  function() {
    const newRate = parseInt(document.getElementById("payRateInput").value); 
    if (!isNaN(newRate) && newRate >= 0) {
      payRate = newRate;
      document.getElementById("payRateDisplay").textContent  = 
        payRate.toLocaleString(currentLang  === 'ja' ? 'ja-JP' : undefined) + ' ' + 
        translations[currentLang].payCurrency;
      saveState();
      updateOvertimePay();
    }
  });
 
  // 恢复状态或询问工作时间 
  if (!restoreState()) {
    askStartTime();
  } else {
    renderTimeline();
  }
  
  // 设置语言切换按钮 
  document.getElementById("languageBtn").addEventListener("click",  switchLanguage);
  
  // 设置重置按钮 
  document.getElementById("resetBtn").addEventListener("click",  function() {
    const t = translations[currentLang];
    localStorage.removeItem('workStartTime'); 
    localStorage.removeItem('workTimerState'); 
    if (askStartTime()) {
      this.textContent  = t.resetConfirm; 
      setTimeout(() => this.textContent  = t.resetBtn,  2000);
    }
  });
  updateInterval = setInterval(update, 1000);
  update();

  // 设置下班按钮 
  document.getElementById("stopBtn").addEventListener("click",  function() {
    isTimerStopped = true;
    clearInterval(updateInterval); // 清除定时器 
    // 更新按钮文本为"已停止"
    const t = translations[currentLang];
    this.textContent  = t.stopBtn  + " ✓";
    // 保存状态 
    saveState();
    this.style.backgroundColor  = "#4CAF50";
    this.style.color  = "white";
});




});
