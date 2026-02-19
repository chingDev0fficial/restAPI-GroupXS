import { closedProtocols } from "../../../database/mockData";

type ClosedProtocol = {
    id: string,
    siteId: string,
    plantId: string,
    level1: string,
    name: string,
    basedOn: string,
    date: string,
    owner: string,
    status: string,
}

class CloseProtocolServices {

    public async getAllClosedProtocols() {
        return closedProtocols as ClosedProtocol[];
    }

    public async getClosedProtocolById(id: string) {
        return closedProtocols.find((protocol) => protocol.id === id) || null;
    }
}

export default new CloseProtocolServices();