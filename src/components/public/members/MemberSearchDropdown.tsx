import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, User, X } from 'lucide-react';
import { PublicMember } from '../../../types';
import { toBengaliNumber } from '../../../utils/bengali';

interface MemberSearchDropdownProps {
  members: PublicMember[];
  selectedMemberId: string | null;
  onSelectMember: (memberId: string) => void;
}

export const MemberSearchDropdown: React.FC<MemberSearchDropdownProps> = ({
  members,
  selectedMemberId,
  onSelectMember,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedMember = members.find((m) => m.member_id === selectedMemberId || m.id === selectedMemberId);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMembers = members.filter((m) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      m.full_name.toLowerCase().includes(q) ||
      m.member_id.toLowerCase().includes(q) ||
      (m.occupation && m.occupation.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full max-w-2xl mx-auto mb-8" ref={dropdownRef}>
      <label className="block text-sm font-bold text-[#073D32] mb-2 font-bengali">
        সদস্য নির্বাচন করুন (Search & Select Member):
      </label>

      {/* Main trigger button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3.5 bg-white border rounded-xl text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#075B46] ${
            isOpen ? 'border-[#075B46] ring-2 ring-[#075B46]/20' : 'border-[#E2E8E0] hover:border-[#075B46]/60'
          }`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3 truncate">
            <div className="w-8 h-8 rounded-full bg-[#F8FAF7] border border-[#075B46]/20 flex items-center justify-center text-[#075B46] shrink-0">
              <User className="w-4 h-4" />
            </div>
            {selectedMember ? (
              <div className="truncate">
                <div className="text-sm font-bold text-[#073D32] font-bengali truncate">
                  {selectedMember.full_name}
                </div>
                <div className="text-xs text-[#075B46] font-english font-medium">
                  ID: {selectedMember.member_id} {selectedMember.occupation ? `· ${selectedMember.occupation}` : ''}
                </div>
              </div>
            ) : (
              <span className="text-sm text-[#202923]/60 font-bengali">
                সদস্যের নাম নির্বাচন করুন
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-[#075B46] transition-transform duration-200 shrink-0 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {/* Floating Dropdown List */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#075B46]/20 shadow-2xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Search Input Box */}
            <div className="p-3 bg-[#F8FAF7] border-b border-[#E2E8E0]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#075B46] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="নাম বা আইডি দিয়ে খুঁজুন (e.g. AFS-001 বা রফিকুল)..."
                  className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-[#E2E8E0] rounded-lg text-[#202923] placeholder-[#202923]/50 focus:outline-none focus:border-[#075B46] font-bengali"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Member Options List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => {
                  const isSelected =
                    member.member_id === selectedMemberId || member.id === selectedMemberId;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => {
                        onSelectMember(member.member_id);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[#F8FAF7] ${
                        isSelected ? 'bg-[#075B46]/10 text-[#073D32]' : 'text-[#202923]'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-english shrink-0 ${
                            isSelected
                              ? 'bg-[#075B46] text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {member.member_id.replace('AFS-', '')}
                        </div>
                        <div className="truncate">
                          <div className="text-sm font-semibold font-bengali truncate">
                            {member.full_name}
                          </div>
                          <div className="text-xs text-[#075B46] font-english">
                            {member.member_id}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-[#075B46] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-[#202923]/60 font-bengali">
                  কোনো সদস্যের তথ্য পাওয়া যায়নি। সঠিক নাম বা আইডি দিয়ে চেষ্টা করুন।
                </div>
              )}
            </div>

            <div className="p-2.5 bg-[#F8FAF7] border-t border-[#E2E8E0] text-[11px] text-center text-[#202923]/60 font-bengali">
              মোট নিবন্ধিত সদস্য: {toBengaliNumber(members.length)} জন (স্থায়ী সদস্য তালিকা)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
