package leshan.server.lwm2m.security;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * An in-memory security registry.
 */
public class SecurityRegistryImpl implements SecurityRegistry {

    // by client end-point
    private Map<String, SecurityInfo> securityByEp = new ConcurrentHashMap<>();

    // by PSK identity
    private Map<String, SecurityInfo> securityByIdentity = new ConcurrentHashMap<>();

    /**
     * {@inheritDoc}
     */
    @Override
    public SecurityInfo get(String endpoint) {
        return securityByEp.get(endpoint);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Map<String, SecurityInfo> getAll() {
        return Collections.unmodifiableMap(securityByEp);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public synchronized SecurityInfo add(String endpoint, SecurityInfo info) {
        SecurityInfo previous = securityByEp.put(endpoint, info);

        if (previous != null) {
            securityByIdentity.remove(previous.getIdentity());
        }
        if (info.getIdentity() != null) {
            securityByIdentity.put(info.getIdentity(), info);
        }

        return previous;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public synchronized SecurityInfo remove(String endpoint) {
        SecurityInfo info = securityByEp.get(endpoint);
        if (info != null) {
            if (info.getIdentity() != null) {
                securityByIdentity.remove(info.getIdentity());
            }
            return securityByEp.remove(endpoint);
        }
        return null;
    }

    // /////// PSK store

    /**
     * {@inheritDoc}
     */
    @Override
    public byte[] getKey(String identity) {
        SecurityInfo info = securityByIdentity.get(identity);
        if (info == null || info.getPreSharedKey() == null) {
            return null;
        } else {
            // defensive copy
            return Arrays.copyOf(info.getPreSharedKey(), info.getPreSharedKey().length);
        }
    }

}