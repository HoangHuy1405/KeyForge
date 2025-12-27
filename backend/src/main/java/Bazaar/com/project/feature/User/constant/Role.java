package Bazaar.com.project.feature.User.constant;

import java.util.Collections;
import java.util.Set;
import java.util.LinkedHashSet;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import static Bazaar.com.project.feature.User.constant.Permission.*;

@RequiredArgsConstructor
public enum Role {
    USER(Collections.emptySet()),
    SELLER(Collections.emptySet()),
    ADMIN(
            Set.of(
                    ADMIN_READ,
                    ADMIN_UPDATE,
                    ADMIN_CREATE,
                    ADMIN_DELETE));

    @Getter
    private final Set<Permission> permissions;

    public Set<GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> auths = new LinkedHashSet<>();
        // Role authority
        auths.add(new SimpleGrantedAuthority("ROLE_" + name()));
        // Fine-grained permissions (use the string value, not enum name)
        permissions.forEach(p -> auths.add(new SimpleGrantedAuthority(p.getPermission())));
        return auths;
    }
}
