package leshan.client.lwm2m.resource;

import java.util.concurrent.ScheduledExecutorService;

import leshan.client.lwm2m.exchange.LwM2mExchange;

public interface LwM2mClientResource extends LwM2mClientNode {

	@Override
	public void read(LwM2mExchange exchange);

	@Override
	public void observe(LwM2mExchange exchange, ScheduledExecutorService service);

	public void write(LwM2mExchange exchange);

	public void execute(LwM2mExchange exchange);

	public boolean isReadable();

	public void notifyResourceUpdated();
}
