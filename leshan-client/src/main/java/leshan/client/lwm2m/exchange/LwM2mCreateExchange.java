package leshan.client.lwm2m.exchange;

import leshan.client.lwm2m.resource.LwM2mClientObjectInstance;

public interface LwM2mCreateExchange extends LwM2mExchange {

	void setObjectInstance(LwM2mClientObjectInstance instance);

}