// ClassCyberPulse - Bộ quy tắc nội dung học đường, không dùng API AI.
// Đây là bộ lọc mẫu câu, không phải mô hình hiểu ngữ nghĩa.
(function () {
  'use strict';
  const normalize = value => String(value || '').normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
  const blocked = [
    /(?:^|[^\p{L}])(?:đm|vkl|vcl)(?=$|[^\p{L}])/u,
    /óc chó|cút đi|đồ ngu|đồ chó|không ai ưa bạn/u,
    /thi trượt hết/u,
    /(?:chúc|mong|ước).{0,40}(?:bị bắn|bị đánh|bị giết|bị tai nạn|gặp nạn|thi trượt|bạn chết)/u,
    /(?:tao|tớ|mình).{0,30}(?:sẽ đánh|sẽ giết|đập chết|xử mày)/u,
    /(?:đánh chết|giết chết|đập chết) (?:mày|bạn|nó)/u
  ];
  const sensitive = [
    /không muốn sống nữa|muốn tự tử|muốn chết|tự làm hại bản thân/u,
    /(?:tao|tôi).{0,30}(?:trả thù|giết người)/u
  ];
  window.checkSchoolContent = function (content, type) {
    const text = normalize(content);
    const min = type === 'ethics' ? 50 : 6;
const max = type === 'ethics' ? 3000 : 2000;
    if (text.length < min || text.length > max) return {
      status: 'rejected', message: `⚠️ Nội dung cần từ ${min} đến ${max} ký tự.`
    };
    if (sensitive.some(re => re.test(text))) return {
      status: 'review',
      message: '💙 Nội dung có dấu hiệu cần hỗ trợ hoặc chưa rõ ngữ cảnh. Vui lòng viết rõ hơn; nếu đang gặp khó khăn hãy tìm người lớn đáng tin cậy để được giúp đỡ.'
    };
    if (blocked.some(re => re.test(text))) return {
      status: 'rejected', message: '❌ Nội dung có dấu hiệu xúc phạm, đe dọa hoặc trù ẻo. Vui lòng chỉnh sửa trước khi đăng.'
    };
    if (/(.)\1{7,}/u.test(text) || /https?:\/\/|www\./i.test(text)) return {
      status: 'rejected', message: '❌ Vui lòng không gửi nội dung lặp ký tự quá nhiều hoặc liên kết.'
    };
    return { status: 'approved', message: '✅ Đã qua kiểm tra tự động cơ bản.' };
  };
})();
