import React, { useState, useEffect } from 'react';
import { createClient } from '@base44/sdk';

const base44 = createClient();

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); // home, pledge, archive, inquiry, settings, admin_dashboard
  const [currentUser, setCurrentUser] = useState(null);
  const [adminSubTab, setAdminSubTab] = useState('member_link'); // 신청, 문의, 공약, 멤버링크, 관리자단톡, 공식링크, 게시판, 사용자, 관리자승인
  const [unreadCount, setUnreadCount] = useState(2); // 예시 알림 개수

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = await base44.auth.me();
      if (user) {
        setCurrentUser({
          email: user.email,
          nickname: user.nickname || '리모',
          role: user.role || 'super_admin', // 'super_admin', 'admin', 'user'
          profile_image: user.profile_image || ''
        });
      } else {
        // 비로그인 게스트 시뮬레이션
        setCurrentUser({ nickname: '게스트', role: 'guest' });
      }
    } catch (e) {
      setCurrentUser({ nickname: '게스트', role: 'guest' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] flex flex-col font-sans max-w-md mx-auto relative shadow-xl pb-24">
      
      {/* 상단 헤더 (스크린샷 공통 디자인) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
            <img src={currentUser?.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150"} alt="프로필" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-gray-900 leading-none">LINEUP HUB</h1>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">단방향 팬 아카이브</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role !== 'guest' && (
            <span className="text-[11px] font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
              {currentUser?.role === 'super_admin' ? '총괄 관리자' : currentUser?.role === 'admin' ? '관리자' : '일반회원'}
            </span>
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'super_admin') && (
            <button 
              onClick={() => setCurrentTab('admin_dashboard')}
              className={`p-2 rounded-xl transition-colors ${currentTab === 'admin_dashboard' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              🛡️
            </button>
          )}

          <button onClick={() => alert('알림 목록')} className="p-2 relative bg-gray-50 rounded-full hover:bg-gray-100">
            🔔
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </button>

          <button onClick={() => setCurrentTab('settings')} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
            ⚙️
          </button>
        </div>
      </header>

      {/* 메인 화면 렌더링 */}
      <main className="flex-1 p-4 space-y-4">
        {currentTab === 'home' && <HomeView />}
        {currentTab === 'pledge' && <PledgeView />}
        {currentTab === 'archive' && <ArchiveView />}
        {currentTab === 'inquiry' && <InquiryView />}
        {currentTab === 'settings' && <SettingsView currentUser={currentUser} setCurrentTab={setCurrentTab} />}
        {currentTab === 'admin_dashboard' && <AdminDashboardView adminSubTab={adminSubTab} setAdminSubTab={setAdminSubTab} />}
      </main>

      {/* 하단 고정 내비게이션 바 */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-around py-3 z-40 shadow-lg">
        {[
          { id: 'home', label: '홈', icon: '🏠' },
          { id: 'pledge', label: '공약', icon: '🎯' },
          { id: 'archive', label: '아카이브', icon: '📁' },
          { id: 'inquiry', label: '문의', icon: '💬' },
          { id: 'settings', label: '설정', icon: '👤' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center flex-1 text-[11px] font-semibold transition-colors ${
              currentTab === tab.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-base mb-0.5">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ----------------- 1. 홈 화면 (스크린샷 1, 2 반영) -----------------
function HomeView() {
  return (
    <div className="space-y-4">
      {/* 공식 홈페이지 바로가기 카드 */}
      <a href="https://lineup-hub.vercel.app" target="_blank" rel="noreferrer" className="block bg-[#111827] text-white p-4 rounded-2xl shadow-md hover:bg-black transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🌐</span>
            <div>
              <p className="font-bold text-sm">공식 홈페이지</p>
              <p className="text-xs text-gray-400">lineup-hub.vercel.app</p>
            </div>
          </div>
          <span className="text-gray-400 text-sm">↗</span>
        </div>
      </a>

      {/* 브랜드 로고 및 타이틀 */}
      <div className="text-center py-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold mb-2">LOGO</div>
        <h2 className="text-lg font-black tracking-tight">LINEUP HUB</h2>
      </div>

      {/* 게시판 바로가기 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-lg">📌</span>
          <div>
            <p className="font-bold text-sm text-gray-900">게시판</p>
            <p className="text-xs text-gray-400">공지와 안내를 확인하세요</p>
          </div>
        </div>
        <span className="text-gray-400">→</span>
      </div>

      {/* 공식 계좌 박스 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <span>🏦</span> 공식 계좌
        </div>
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
          <div>
            <p className="text-xs font-bold text-gray-800">라인업컴퍼니 공식 계좌</p>
            <p className="text-[11px] text-gray-500 font-mono mt-0.5">부산은행 101-2096-7592-09</p>
          </div>
          <button onClick={() => alert('계좌가 복사되었습니다!')} className="bg-[#111827] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm">
            📋 계좌 복사
          </button>
        </div>
      </div>

      {/* 공식 링크 2x2 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: '라인업 공식 인스타', url: 'www.instagram.com', icon: '라' },
          { label: '라인업 공식 유튜브', url: 'youtube.com', icon: '라' },
          { label: '라인업 공식 틱톡', url: 'www.tiktok.com', icon: '라' },
          { label: '라인업 공식 X(트위터)', url: 'x.com', icon: '라' },
          { label: '본방 라이브 (킥)', url: 'kick.com', icon: '본' },
          { label: '라인업 컴퍼니 투네이션', url: 'toon.at', icon: '라' },
        ].map((link, idx) => (
          <a key={idx} href={`https://${link.url}`} target="_blank" rel="noreferrer" className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between h-24">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-gray-100 text-[10px] font-bold flex items-center justify-center text-gray-600">{link.icon}</span>
              <span className="text-gray-400 text-xs">↗</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 truncate">{link.label}</p>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">{link.url}</p>
            </div>
          </a>
        ))}
      </div>

      {/* 크루 선택 섹션 (월수토 / 화목일) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <span>👥</span> 크루 선택
        </div>

        {/* 월수토 크루 카드 */}
        <div className="bg-[#111827] text-white p-4 rounded-2xl shadow-md space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] text-gray-400 block">매주 월 · 수 · 토</span>
              <h3 className="text-base font-black">월수토</h3>
            </div>
            <span className="text-gray-400">→</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl flex items-center justify-between">
            <span className="text-xs text-gray-300">라인업 컴퍼니 월수토</span>
            <span className="text-xs text-gray-300">외 13명 · 총 17명</span>
          </div>
        </div>

        {/* 화목일 크루 카드 */}
        <div className="bg-[#111827] text-white p-4 rounded-2xl shadow-md space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] text-gray-400 block">매주 화 · 목 · 일</span>
              <h3 className="text-base font-black">화목일</h3>
            </div>
            <span className="text-gray-400">→</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl flex items-center justify-between">
            <span className="text-xs text-gray-300">라인업 컴퍼니 화목일</span>
            <span className="text-xs text-gray-300">외 13명 · 총 17명</span>
          </div>
        </div>
      </div>

      {/* 이용 주의사항 및 안내 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2 text-xs text-gray-600">
        <p className="font-bold text-gray-900 flex items-center gap-1.5">
          <span>ℹ️</span> 이용 주의사항 및 안내
        </p>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500 pl-1">
          <li>부적절한 단어 사용이나 문제가 될 여지가 있는 게시물 신청 시에는 등록이 반려(미승인)될 수 있습니다.</li>
          <li>모든 게시물은 철저하게 관리진에 의해 검수됩니다.</li>
          <li>기타 궁금한 점은 언제든지 1:1 문의 페이지를 통해 전달해 주세요.</li>
        </ul>
      </div>
    </div>
  );
}

// ----------------- 2. 공약 페이지 -----------------
function PledgeView() {
  return <div className="p-6 bg-white rounded-2xl shadow-sm text-center">공지사항 및 멤버 공약표 화면</div>;
}

// ----------------- 3. 아카이브 페이지 (스크린샷 3 반영) -----------------
function ArchiveView() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer">
        <span>← 아카이브</span>
      </div>

      {/* 미디어 카드 예시 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-4 space-y-3">
        <div className="w-full h-80 bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600" alt="아카이브" className="w-full h-full object-contain" />
        </div>

        {/* 썸네일 리스트 */}
        <div className="flex gap-2">
          <div className="w-12 h-12 rounded-xl border-2 border-indigo-600 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150" alt="thumb" className="w-full h-full object-cover" />
          </div>
          <div className="w-12 h-12 rounded-xl border border-gray-200 overflow-hidden opacity-60">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150" alt="thumb" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">사진</span>
            <span>방송 2026.11.05</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xl">🤍</button>
            <button className="text-xl">🔖</button>
          </div>
        </div>

        <div>
          <h3 className="font-extrabold text-base text-gray-900">골무골무</h3>
          <p className="text-xs text-gray-400 mt-0.5">현이 외 1명 · 2026.11.05</p>
          <p className="text-xs text-gray-700 mt-2">골무가 원래 이리 잘생겼었나</p>
        </div>
      </div>
    </div>
  );
}

// ----------------- 4. 문의 페이지 -----------------
function InquiryView() {
  return <div className="p-6 bg-white rounded-2xl shadow-sm text-center">1:1 문의 및 답변 확인 화면</div>;
}

// ----------------- 5. 설정 화면 (스크린샷 4, 5 반영) -----------------
function SettingsView({ currentUser, setCurrentTab }) {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
        <h2 className="text-base font-black text-gray-900">내 정보</h2>
        <p className="text-xs text-gray-400">계정, 보안, 내 활동을 관리합니다.</p>
      </div>

      {/* 사용자 프로필 카드 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            <img src={currentUser?.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150"} alt="프로필" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">{currentUser?.nickname || '리모'}</h3>
            <p className="text-xs text-gray-400">tlqkfrorkxek09@gmail.com</p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
          {currentUser?.role === 'super_admin' ? '총괄 관리자' : '관리자'}
        </span>
      </div>

      {/* 프로필 닉네임 수정 폼 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-gray-900">프로필 · 닉네임</h3>
        <p className="text-[11px] text-gray-400">닉네임과 프로필 사진은 하루 1회 수정할 수 있어요. (한글·영어·기호 가능, 이모티콘 제외)</p>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700">프로필 사진</label>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-100 relative overflow-hidden border border-gray-200">
              <img src={currentUser?.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150"} alt="프로필" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs">📷</div>
            </div>
            <span className="text-xs text-gray-500">사진을 눌러 변경 (공개 저장)</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">닉네임</label>
          <input type="text" defaultValue={currentUser?.nickname || '리모'} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium" />
        </div>

        <button className="w-full py-3 bg-[#111827] text-white font-bold text-xs rounded-xl shadow-sm">프로필 저장</button>
      </div>

      {/* 언어 설정 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
        <h3 className="font-bold text-sm text-gray-900">🌐 언어 설정</h3>
        <p className="text-[11px] text-gray-400">앱 화면 언어를 선택하세요. 한국어가 기본입니다.</p>
        <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium">
          <option>한국어</option>
          <option>English</option>
          <option>中文</option>
          <option>日本語</option>
          <option>Español</option>
        </select>
      </div>

      {/* 총괄 관리자 대시보드 진입 버튼 (스크린샷 4 보라색 원 참고) */}
      <div onClick={() => setCurrentTab('admin_dashboard')} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-lg">🛡️</span>
          <div>
            <h3 className="font-bold text-sm text-gray-900">총괄 관리자 대시보드</h3>
            <p className="text-[11px] text-gray-400">게시물 승인 · 문의 답변 · 공약 관리</p>
          </div>
        </div>
        <span className="text-gray-400">›</span>
      </div>
    </div>
  );
}

// ----------------- 6. 총괄 관리자 대시보드 (스크린샷 6, 7, 8, 9, 10 반영) -----------------
function AdminDashboardView({ adminSubTab, setAdminSubTab }) {
  const tabs = [
    { id: 'request', label: '신청' },
    { id: 'inquiry', label: '문의' },
    { id: 'pledge', label: '공약' },
    { id: 'member_link', label: '멤버링크' },
    { id: 'chat', label: '관리자단톡' },
    { id: 'official_link', label: '공식링크' },
    { id: 'board', label: '게시판' },
    { id: 'user', label: '사용자' },
    { id: 'admin_auth', label: '관리자승인' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
        <h2 className="text-base font-black text-gray-900">총괄 관리자 대시보드</h2>
        <p className="text-xs text-gray-400">게시물 검수와 문의 답변을 처리합니다.</p>
      </div>

      {/* 대시보드 내부 메뉴 탭 그리드 */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-4 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminSubTab(tab.id)}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
              adminSubTab === tab.id ? 'bg-[#111827] text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 서브 탭 컨텐츠별 렌더링 */}
      {adminSubTab === 'member_link' && <AdminMemberLinkSection />}
      {adminSubTab === 'pledge' && <AdminPledgeSection />}
      {adminSubTab === 'board' && <AdminBoardSection />}
      {adminSubTab === 'user' && <AdminUserSection />}
      {adminSubTab === 'admin_auth' && <AdminAuthSection />}
      {adminSubTab !== 'member_link' && adminSubTab !== 'pledge' && adminSubTab !== 'board' && adminSubTab !== 'user' && adminSubTab !== 'admin_auth' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center text-gray-400 text-xs">
          선택한 관리자 메뉴 화면입니다.
        </div>
      )}
    </div>
  );
}

// ----------------- 서브 섹션 컴포넌트들 (디자인 스크린샷 9, 10, 8, 7, 6 반영) -----------------

// 1. 멤버 링크 추가 섹션 (스크린샷 9 반영)
function AdminMemberLinkSection() {
  const membersList = ['준호', '키리', '혁근', '하율', '준용', '해수', '싸비', '한이', '현이', '동욱', '진구', '시혁', '여울', '민재', '우기', '리원', '로하', '유원', 'CK', '락민', '현호', '박하', '성훈', '버미', '해인', '도리', '준우', '제로', '하민', '우신', '재중', '이노움', '지호', '차노'];
  const [selectedMembers, setSelectedMembers] = useState([]);

  const toggleMember = (name) => {
    if (selectedMembers.includes(name)) {
      setSelectedMembers(selectedMembers.filter(m => m !== name));
    } else {
      setSelectedMembers([...selectedMembers, name]);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
      <h3 className="font-bold text-sm text-gray-900">새 멤버 링크 추가</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <select className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium">
          <option>유튜브</option>
          <option>인스타</option>
          <option>투네이션</option>
          <option>틱톡</option>
          <option>계좌</option>
        </select>
        <select className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium">
          <option>공통</option>
          <option>월수토</option>
          <option>화목일</option>
        </select>
      </div>

      <input type="text" placeholder="링크 이름 (예: 유원 유튜브)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium" />
      <input type="url" placeholder="https://..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium" />
      <input type="text" placeholder="계좌 정보 (선택 · 예: 농협 123-45-67890 예금주명)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium" />

      {/* 멤버 선택 칩 영역 */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-gray-700">멤버 선택 (중복 가능)</span>
          <span className="text-gray-400">이 크루 전체 선택 <span className="text-indigo-600 font-bold">선택 {selectedMembers.length}명</span></span>
        </div>
        <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium">
          <option>전체 크루</option>
        </select>
        
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-100">
          {membersList.map((m, idx) => {
            const isSelected = selectedMembers.includes(m);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleMember(m)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isSelected ? 'bg-[#111827] text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <button className="w-full py-3 bg-[#111827] text-white font-bold text-xs rounded-xl shadow-sm">추가</button>
    </div>
  );
}

// 2. 공약 등록 및 목록 섹션 (스크린샷 10 반영)
function AdminPledgeSection() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-gray-900">새 공약 등록</h3>
        <div className="grid grid-cols-2 gap-2">
          <select className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"><option>멤버</option></select>
          <select className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"><option>당일 공약</option></select>
        </div>
        <input type="text" placeholder="시즌 (예: 시즌 5) — 비워도 됨" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium" />
        <input type="text" placeholder="공약 제목" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium" />
        <textarea placeholder="공약 내용" rows="2" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium resize-none"></textarea>
        <div className="border-2 border-dashed border-gray-200 p-4 rounded-xl text-center text-xs text-gray-400">📷 사진 첨부</div>
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 font-medium">2026. 11. 8.</div>
        <button className="w-full py-3 bg-[#111827] text-white font-bold text-xs rounded-xl">등록</button>
      </div>

      {/* 기존 공약 리스트 */}
      <div className="space-y-2">
        {[
          { title: '로하 시즌 5공약', desc: '로하 · 시즌 공약 · 시즌 5 · 2026.11.08' },
          { title: 'CK 시즌 4공약', desc: 'CK · 시즌 공약 · 시즌 4 · 2026.11.08' },
          { title: '차노 시즌 4공약', desc: '차노 · 시즌 공약 · 시즌 4 · 2026.11.08' },
          { title: '해인 시즌 4공약', desc: '해인 · 시즌 공약 · 시즌 4 · 2026.11.08' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-gray-900">{item.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <button className="text-gray-400 hover:text-red-500 text-sm p-1">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. 게시판 작성 섹션 (스크린샷 8 반영)
function AdminBoardSection() {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
      <h3 className="font-bold text-sm text-gray-900">새 게시글 작성</h3>
      <input type="text" placeholder="제목" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium" />
      <textarea placeholder="내용(글자 수 제한 없음)" rows="4" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium resize-none"></textarea>
      <div className="border-2 border-dashed border-gray-200 p-4 rounded-xl text-center text-xs text-gray-400">📷 사진/영상 추가 (0/8)</div>
      
      <div className="flex items-center gap-4 text-xs font-medium text-gray-600 pt-1">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" className="rounded border-gray-300" /> 상단 고정
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" className="rounded border-gray-300" /> 가입 시 팝업
        </label>
      </div>

      <button className="w-full py-3 bg-[#111827] text-white font-bold text-xs rounded-xl shadow-sm">게시글 등록</button>
    </div>
  );
}

// 4. 사용자 목록 및 주의 섹션 (스크린샷 7 반영)
function AdminUserSection() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
        <p className="text-xs text-gray-500">가입한 사용자 목록입니다. 닉네임이 부적절한 경우 주의를 줄 수 있어요.</p>
      </div>

      <div className="space-y-2">
        {[
          { name: '황세연', email: 's3.y30n09@gmail.com' },
          { name: '황세연', email: 'hseyeon1234567@gmail.com' },
        ].map((user, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">황</div>
              <div>
                <p className="font-bold text-xs text-gray-900">{user.name}</p>
                <p className="text-[10px] text-gray-400">{user.email}</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-amber-50 text-amber-700 font-bold text-[11px] rounded-xl border border-amber-200 flex items-center gap-1">
              ⚠️ 주의
            </button>
          </div>
        ))}
      </div>

      {/* 운영진 리스트 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
        <h4 className="font-bold text-xs text-gray-900">🛡️ 운영진</h4>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500">
          <div className="p-2 bg-gray-50 rounded-xl">관리자</div>
          <div className="p-2 bg-gray-50 rounded-xl">관리자</div>
          <div className="p-2 bg-gray-50 rounded-xl">관리자</div>
          <div className="p-2 bg-gray-50 rounded-xl">관리자</div>
        </div>
      </div>
    </div>
  );
}

// 5. 관리자 승인 섹션 (스크린샷 6 반영)
function AdminAuthSection() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
        <h3 className="font-bold text-sm text-gray-900">🔗 관리자 임명 링크</h3>
        <p className="text-[11px] text-gray-400">이 링크를 전달받은 사람이 비밀번호를 입력해 신청하면, 여기서 승인해 관리자로 임명할 수 있습니다.</p>
        <div className="flex gap-2">
          <input type="text" readOnly value="https://lineup-hub-copy-b1f891cf.base44.app/ad..." className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-500 font-mono" />
          <button onClick={() => alert('링크 복사됨')} className="bg-[#111827] text-white text-xs font-bold px-4 py-2.5 rounded-xl">📋 복사</button>
        </div>
      </div>

      {/* 현재 관리자 목록 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-gray-900">👤 현재 관리자 (3명)</h3>
        {[
          { name: '정희원', email: 'jhwon1209@gmail.com' },
          { name: 'iamkiki032', email: 'iamkiki032@gmail.com' },
          { name: 'dori.osu.save', email: 'dori.osu.save@gmail.com' },
        ].map((admin, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="font-bold text-xs text-gray-900">{admin.name}</p>
              <p className="text-[10px] text-gray-400">{admin.email}</p>
            </div>
            <button className="px-3 py-1 bg-red-50 text-red-600 font-bold text-[11px] rounded-lg">해제</button>
          </div>
        ))}
      </div>

      {/* 임명 신청 내역 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-gray-900">임명 신청 내역</h3>
        <div className="p-3 bg-gray-50 rounded-xl space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold text-[10px] rounded">승인</span>
            <span className="text-[10px] text-gray-400">2026.11.07</span>
          </div>
          <p className="font-bold text-xs text-gray-900">dori.osu.save</p>
          <p className="text-[10px] text-gray-400">dori.osu.save@gmail.com</p>
          <p className="text-[10px] text-gray-500 pt-1">처리: 리모</p>
        </div>
      </div>
    </div>
  );
}
