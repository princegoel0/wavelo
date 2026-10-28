// Every @keyframes used by the catalog. Shared by all slices so a page that
// mixes designs still ships each frame set exactly once.
export const keyframesCss = `
@keyframes wavelo-stripe{to{background-position:32px 0}}
@keyframes wavelo-highlight{to{transform:translateX(100%)}}
@keyframes wavelo-spin{to{transform:rotate(360deg)}}
@keyframes wavelo-pulse{0%,100%{transform:scale(.6);opacity:.45}50%{transform:scale(1);opacity:1}}
@keyframes wavelo-bars{0%,100%{height:30%;opacity:.5}50%{height:100%;opacity:1}}
@keyframes wavelo-wave{0%,100%{transform:translateY(25%)}50%{transform:translateY(-25%)}}
@keyframes wavelo-shape{0%,100%{transform:rotate(0) scale(.8);border-radius:15%}50%{transform:rotate(180deg) scale(1);border-radius:50%}}
@keyframes wavelo-cube{to{transform:rotateX(360deg) rotateY(360deg)}}
@keyframes wavelo-polygon{50%{transform:rotate(180deg) scale(.8)}}
@keyframes wavelo-triangle{50%{transform:rotate(180deg) scale(.7)}}
@keyframes wavelo-fold{50%{transform:perspective(4rem) rotateY(70deg)}}
@keyframes wavelo-orbit{from{transform:rotate(var(--orbit-angle)) translateX(calc(var(--wavelo-size) * .32))}to{transform:rotate(calc(var(--orbit-angle) + 360deg)) translateX(calc(var(--wavelo-size) * .32))}}
@keyframes wavelo-dot-orbit{to{transform:rotate(360deg)}}
@keyframes wavelo-bounce-dot{0%,100%{transform:translateY(25%);opacity:.5}50%{transform:translateY(-45%);opacity:1}}
@keyframes wavelo-fade-dot{0%,100%{opacity:.2}50%{opacity:1}}
@keyframes wavelo-scale-dot{0%,100%{transform:scale(.45)}50%{transform:scale(1.35)}}
@keyframes wavelo-alt-dot{50%{transform:translateY(-50%)}}
@keyframes wavelo-alt-dot-reverse{50%{transform:translateY(50%)}}
@keyframes wavelo-stagger-dot{0%,100%{transform:translateY(20%)}50%{transform:translateY(-35%)}}
@keyframes wavelo-equalizer{0%,100%{height:20%}50%{height:100%}}
@keyframes wavelo-bounce-bar{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
@keyframes wavelo-pulse-bar{0%,100%{transform:scaleY(.5);opacity:.5}50%{transform:scaleY(1);opacity:1}}
@keyframes wavelo-fade-bar{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes wavelo-grow-bar{0%,100%{height:25%}50%{height:100%}}
@keyframes wavelo-waveform{0%,100%{height:25%;transform:translateY(20%)}50%{height:100%;transform:translateY(-20%)}}
@keyframes wavelo-waveform-reverse{0%,100%{height:100%;transform:translateY(-20%)}50%{height:25%;transform:translateY(20%)}}
@keyframes wavelo-horizontal-pulse{0%,100%{transform:scaleX(.55);opacity:.5}50%{transform:scaleX(1);opacity:1}}
@keyframes wavelo-helix{0%,100%{transform:translateX(-35%)}50%{transform:translateX(35%)}}
@keyframes wavelo-helix-line{0%,100%{transform:rotate(18deg) scaleX(.7)}50%{transform:rotate(-18deg) scaleX(1)}}
@keyframes wavelo-ripple{0%{transform:scale(.2);opacity:1}100%{transform:scale(1);opacity:0}}
@keyframes wavelo-expand-ring{0%,100%{transform:scale(.7);opacity:.8}50%{transform:scale(1.1);opacity:.2}}
@keyframes wavelo-infinity{0%,100%{transform:translateX(-35%) rotate(0)}50%{transform:translateX(35%) rotate(180deg)}}
@keyframes wavelo-radar{to{transform:rotate(360deg)}}
@keyframes wavelo-square-spin{to{transform:rotate(360deg)}}
@keyframes wavelo-concentric{0%,100%{transform:scale(.65);opacity:.25}50%{transform:scale(1);opacity:1}}
@keyframes wavelo-triangle-orbit{to{transform:rotate(360deg) translateY(-45%)}}
@keyframes wavelo-shimmer{to{background-position:-200% 0}}
@keyframes wavelo-upload{to{background-position:24px 0}}
@keyframes wavelo-transition{to{background-position:-200% 0}}
`;
