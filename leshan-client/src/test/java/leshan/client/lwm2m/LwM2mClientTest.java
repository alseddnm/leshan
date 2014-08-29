package leshan.client.lwm2m;

import java.net.InetSocketAddress;

import leshan.client.lwm2m.bootstrap.BootstrapDownlink;
import leshan.client.lwm2m.bootstrap.BootstrapUplink;
import leshan.client.lwm2m.operation.Executable;
import leshan.client.lwm2m.operation.Readable;
import leshan.client.lwm2m.operation.Writable;
import leshan.client.lwm2m.register.RegisterUplink;
import leshan.client.lwm2m.resource.ClientObject;
import leshan.client.lwm2m.resource.SingleResourceDefinition;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

import ch.ethz.inf.vs.californium.server.Server;
import ch.ethz.inf.vs.californium.server.resources.ResourceBase;

@RunWith(MockitoJUnitRunner.class)
public class LwM2mClientTest {
	@Mock
	private BootstrapDownlink fakeBootstrapDownlink;

	@Mock
	private Server server;

	@Before
	public void setup() {
	}

	@Test
	public void testLegalBootstrapUplinkCreate() {
		final ClientObject object = new ClientObject(1, 
				new SingleResourceDefinition(0, Readable.NOT_READABLE, Writable.NOT_WRITABLE, Executable.NOT_EXECUTABLE));
		final LwM2mClient client = new LwM2mClient(object);
		final BootstrapUplink uplink = client.startBootstrap(4321, InetSocketAddress.createUnresolved("localhost", 1234), fakeBootstrapDownlink);
	}

	@Test(expected=IllegalArgumentException.class)
	public void testIllegalNullBootstrapUplinkCreate() {
		final ClientObject object = new ClientObject(1);
		final LwM2mClient client = new LwM2mClient(object);
		final BootstrapUplink uplink = client.startBootstrap(4321, InetSocketAddress.createUnresolved("localhost", 1234), null);
	}

	@Test(expected=IllegalArgumentException.class)
	public void testIllegalNoObjectsClientCreate() {
		final ClientObject object = new ClientObject(1);
		final LwM2mClient client = new LwM2mClient();
	}

	@Test
	public void testLegalRegisterUplinkCreate() {
		final ClientObject object = new ClientObject(1, 
				new SingleResourceDefinition(0, Readable.NOT_READABLE, Writable.NOT_WRITABLE, Executable.NOT_EXECUTABLE));
		Mockito.when(server.getRoot()).thenReturn(new ResourceBase("basic"));
		final LwM2mClient client = new LwM2mClient(server, object);

		final RegisterUplink uplink = client.startRegistration(4321, InetSocketAddress.createUnresolved("localhost", 1234));

	}

	@Test(expected=IllegalArgumentException.class)
	public void testIllegalNullAddressCreate() {
		final ClientObject object = new ClientObject(1, 
				new SingleResourceDefinition(0, Readable.NOT_READABLE, Writable.NOT_WRITABLE, Executable.NOT_EXECUTABLE));
		final LwM2mClient client = new LwM2mClient(object);
		final RegisterUplink uplink = client.startRegistration(4321, null);
	}

}
