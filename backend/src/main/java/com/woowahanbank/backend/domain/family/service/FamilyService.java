package com.woowahanbank.backend.domain.family.service;

import com.woowahanbank.backend.domain.family.domain.Family;
import com.woowahanbank.backend.domain.family.domain.Invitation;
import com.woowahanbank.backend.domain.family.repository.FamilyRepository;
import com.woowahanbank.backend.domain.family.repository.InvitationRepository;
import com.woowahanbank.backend.domain.user.domain.Role;
import com.woowahanbank.backend.domain.user.domain.User;
import com.woowahanbank.backend.domain.user.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class FamilyService {
    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final InvitationRepository invitationRepository;

    public void createFamily(String nickname, String familyName) {
        User user = userRepository.findByNickname(nickname)
                .filter(u -> u.getType() == Role.ROLE_PARENT)
                .orElseThrow(() -> new IllegalArgumentException("부모 회원만 가능한 기능이거나 유저를 찾을 수 없습니다"));
        Family family = Family.builder().familyName(familyName).build();
        family.addUser(user);
        familyRepository.save(family);
    }

    public void updateFamily(String nickname, String familyName) {
        User user = userRepository.findByNickname(nickname)
                .filter(u -> u.getType() == Role.ROLE_PARENT)
                .orElseThrow(() -> new IllegalArgumentException("부모 회원만 가능한 기능이거나 유저를 찾을 수 없습니다"));
        user.getFamily().updateFamilyName(familyName);
    }

    public void deleteFamily(String nickname) {
        User user = userRepository.findByNickname(nickname)
                .filter(u -> u.getType() == Role.ROLE_PARENT)
                .orElseThrow(() -> new IllegalArgumentException("부모 회원만 가능한 기능이거나 유저를 찾을 수 없습니다"));
        Family family = user.getFamily();
        Optional.ofNullable(family.getUsers())
                .filter(users -> users.size() == 1)
                .ifPresentOrElse(
                        users -> {
                            family.removeUser(user);
                            familyRepository.deleteById(family.getId());
                        },
                        () -> {
                            throw new IllegalArgumentException("가족에 남은 회원이 본인만 있어야 합니다");
                        }
                );
    }

    public void inviteToFamily(String fromUserNickname, String toUserNickname) {
        User fromUser = findUserOrElseThrow(fromUserNickname);
        User toUser = findUserOrElseThrow(toUserNickname);
        Invitation invitation = Invitation.builder()
                .fromUser(fromUser)
                .toUser(toUser)
                .family(fromUser.getFamily())
                .build();
        invitationRepository.save(invitation);
    }

    public void rejectInvitation(String toNickname) {
        Invitation invitation = invitationRepository.findByToUser_Nickname(toNickname)
                .orElseThrow(() -> new IllegalArgumentException("초대 내용을 찾을 수 없습니다"));
        invitationRepository.delete(invitation);
    }

    public void acceptInvitation(String toNickname) {
        Invitation invitation = invitationRepository.findByToUser_Nickname(toNickname)
                .orElseThrow(() -> new IllegalArgumentException("초대 내용을 찾을 수 없습니다"));
        Family family = invitation.getFamily();
        family.addUser(invitation.getToUser());

        invitationRepository.delete(invitation);
    }

    public void removeUserFromFamily(String parentNickname, String targetNickname) {
        User parentUser = findUserOrElseThrow(parentNickname);
        User targetUser = findUserOrElseThrow(targetNickname);

        Family family = parentUser.getFamily();
        if (family.equals(targetUser.getFamily())) {
            throw new IllegalArgumentException("나의 가족만 추방할 수 있습니다");
        }

        family.removeUser(targetUser);
    }

    private User findUserOrElseThrow(String nickname) {
        return userRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다"));
    }
}
