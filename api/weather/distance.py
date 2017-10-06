from geopy.distance import great_circle


def calc_distance(org_lng, org_lat, dest_lng, dest_lat):
    """
    Calculate the directions and distances between two geo coordinates

    :param org_lng:
    :param org_lat:
    :param dest_lng:
    :param dest_lat:
    :return:
    """

    res = great_circle((org_lat,org_lng), (dest_lat, dest_lng))
    return {
        "miles": res.miles,
        "meters": res.meters,
    }